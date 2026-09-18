/* istanbul ignore file */

import { HttpException } from './http.exception.js';
import { HttpStatus } from './http-status.enum.js';
import { ErrorsEnum } from './error.enum.js';
import { DefaultErrorBase, IDefaultErrorBaseOptions } from './default.error.js';
import { HttpStatusCode } from 'axios';

// Map NestJS common exceptions to HttpException
export function createHttpException(status: number) {
  return class extends HttpException {
    constructor(objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions) {
      super(
        HttpException.createBody(objectOrError, typeof descriptionOrOptions === 'string' ? descriptionOrOptions : descriptionOrOptions?.description, status),
        status,
        typeof descriptionOrOptions !== 'string' ? descriptionOrOptions : undefined
      );
    }
  };
}

export class BadRequestException extends createHttpException(HttpStatus.BAD_REQUEST) {}
export class UnauthorizedException extends createHttpException(HttpStatus.UNAUTHORIZED) {}
export class ForbiddenException extends createHttpException(HttpStatus.FORBIDDEN) {}
export class NotFoundException extends createHttpException(HttpStatus.NOT_FOUND) {}
export class ConflictException extends createHttpException(HttpStatus.CONFLICT) {}
export class InternalServerErrorException extends createHttpException(HttpStatus.INTERNAL_SERVER_ERROR) {}
export class MethodNotAllowedException extends createHttpException(HttpStatus.METHOD_NOT_ALLOWED) {}
export class NotAcceptableException extends createHttpException(HttpStatus.NOT_ACCEPTABLE) {}
export class GoneException extends createHttpException(HttpStatus.GONE) {}
export class UnsupportedMediaTypeException extends createHttpException(HttpStatus.UNSUPPORTED_MEDIA_TYPE) {}
export class UnprocessableEntityException extends createHttpException(HttpStatus.UNPROCESSABLE_ENTITY) {}
export class NotImplementedException extends createHttpException(HttpStatus.NOT_IMPLEMENTED) {}
export class BadGatewayException extends createHttpException(HttpStatus.BAD_GATEWAY) {}
export class ServiceUnavailableException extends createHttpException(HttpStatus.SERVICE_UNAVAILABLE) {}
export class GatewayTimeoutException extends createHttpException(HttpStatus.GATEWAY_TIMEOUT) {}
export class MisdirectedException extends createHttpException(HttpStatus.MISDIRECTED) {}
export class PayloadTooLargeException extends createHttpException(HttpStatus.PAYLOAD_TOO_LARGE) {}
export class PreconditionFailedException extends createHttpException(HttpStatus.PRECONDITION_FAILED) {}
export class RequestTimeoutException extends createHttpException(HttpStatus.REQUEST_TIMEOUT) {}

export interface HttpExceptionOptions {
  cause?: Error;
  description?: string;
}

export const httpExceptionStatusCodes: Record<string, number> = {
  [BadRequestException.name]: HttpStatus.BAD_REQUEST,
  [UnauthorizedException.name]: HttpStatus.UNAUTHORIZED,
  [ForbiddenException.name]: HttpStatus.FORBIDDEN,
  [NotFoundException.name]: HttpStatus.NOT_FOUND,
  [MethodNotAllowedException.name]: HttpStatus.METHOD_NOT_ALLOWED,
  [NotAcceptableException.name]: HttpStatus.NOT_ACCEPTABLE,
  [RequestTimeoutException.name]: HttpStatus.REQUEST_TIMEOUT,
  [ConflictException.name]: HttpStatus.CONFLICT,
  [GoneException.name]: HttpStatus.GONE,
  [PreconditionFailedException.name]: HttpStatus.PRECONDITION_FAILED,
  [PayloadTooLargeException.name]: HttpStatus.PAYLOAD_TOO_LARGE,
  [UnsupportedMediaTypeException.name]: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
  [UnprocessableEntityException.name]: HttpStatus.UNPROCESSABLE_ENTITY,
  [InternalServerErrorException.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [NotImplementedException.name]: HttpStatus.NOT_IMPLEMENTED,
  [BadGatewayException.name]: HttpStatus.BAD_GATEWAY,
  [ServiceUnavailableException.name]: HttpStatus.SERVICE_UNAVAILABLE,
  [GatewayTimeoutException.name]: HttpStatus.GATEWAY_TIMEOUT,
  [HttpException.name]: HttpStatus.INTERNAL_SERVER_ERROR,
  [MisdirectedException.name]: HttpStatus.MISDIRECTED,
};

type AxiosHttpStatusCode = (typeof HttpStatusCode)[keyof typeof HttpStatusCode];

function buildArgs(
  errorName: ErrorsEnum,
  internalMessage?: string,
  options?: IDefaultErrorBaseOptions,
): [
  string,
  IDefaultErrorBaseOptions,
  string | object | any,
  string | HttpExceptionOptions,
] {
  const { cause, description, response, ...restOptions } = options ?? {};
  return [
    internalMessage ? `${errorName}: ${internalMessage}` : errorName,
    { ...(restOptions ?? {}), description },
    response ?? {},
    {
      cause,
      description,
    },
  ];
}

function buildArgsHttpException(
  errorName: ErrorsEnum,
  internalMessage?: string,
  options?: IDefaultErrorBaseOptions,
  errorCode?: HttpStatus | AxiosHttpStatusCode,
): [
  string,
  IDefaultErrorBaseOptions,
  string | object | any,
  number,
  HttpExceptionOptions,
] {
  const args = buildArgs(errorName, internalMessage, options);
  return [
    args[0],
    args[1],
    args[2],
    errorCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
    typeof args[3] === 'string' ? { description: args[3] } : args[3],
  ];
}

/**
 * Use when the request could not be understood or was missing required parameters.
 */
export class BadRequestError extends DefaultErrorBase(BadRequestException) {
  static defaultStatusCode = HttpStatus.BAD_REQUEST;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.BAD_REQUEST, internalMessage, options));
  }
}

/**
 * Use when authentication failed or the user does not have permissions for the desired action.
 */
export class UnauthorizedError extends DefaultErrorBase(UnauthorizedException) {
  static defaultStatusCode = HttpStatus.UNAUTHORIZED;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.UNAUTHORIZED, internalMessage, options));
  }
}

/**
 * Use when the authenticated user does not have access to the requested resource.
 */
export class ForbiddenError extends DefaultErrorBase(ForbiddenException) {
  static defaultStatusCode = HttpStatus.FORBIDDEN;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.FORBIDDEN, internalMessage, options));
  }
}

/**
 * Use when the requested resource could not be found.
 */
export class NotFoundError extends DefaultErrorBase(NotFoundException) {
  static defaultStatusCode = HttpStatus.NOT_FOUND;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.NOT_FOUND, internalMessage, options));
  }
}

/**
 * Use when the request could not be completed due to a conflict with the current state of the target resource.
 */
export class ConflictError extends DefaultErrorBase(ConflictException) {
  static defaultStatusCode = HttpStatus.CONFLICT;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.CONFLICT, internalMessage, options));
  }
}

/**
 * Use when an unexpected error occurred on the server side.
 */
export class InternalServerError extends DefaultErrorBase(
  InternalServerErrorException,
) {
  static defaultStatusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(
      ...buildArgs(ErrorsEnum.INTERNAL_SERVER_ERROR, internalMessage, options),
    );
  }
}

// The following classes are based on HTTP statuses not covered by NestJS built-in exceptions

/**
 * Reserved for future use; its utilization is not common.
 */
export class PaymentRequiredError extends DefaultErrorBase(HttpException) {
  static defaultStatusCode = HttpStatus.PAYMENT_REQUIRED;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(
      ...buildArgsHttpException(
        ErrorsEnum.PAYMENT_REQUIRED,
        internalMessage,
        options,
        PaymentRequiredError.defaultStatusCode,
      ),
    );
  }
}

/**
 * Use when an unsupported HTTP method was used for the request.
 */
export class MethodNotAllowedError extends DefaultErrorBase(
  MethodNotAllowedException,
) {
  static defaultStatusCode = HttpStatus.METHOD_NOT_ALLOWED;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(
      ...buildArgs(ErrorsEnum.METHOD_NOT_ALLOWED, internalMessage, options),
    );
  }
}

/**
 * Use when the server cannot produce a response matching the list of acceptable values defined in the request's headers.
 */
export class NotAcceptableError extends DefaultErrorBase(
  NotAcceptableException,
) {
  static defaultStatusCode = HttpStatus.NOT_ACCEPTABLE;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.NOT_ACCEPTABLE, internalMessage, options));
  }
}

/**
 * Use when the requested resource has been permanently deleted and will not be available again.
 */
export class GoneError extends DefaultErrorBase(GoneException) {
  static defaultStatusCode = HttpStatus.GONE;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.GONE, internalMessage, options));
  }
}

/**
 * Use when the request entity has a media type which the server or resource does not support.
 */
export class UnsupportedMediaTypeError extends DefaultErrorBase(
  UnsupportedMediaTypeException,
) {
  static defaultStatusCode = HttpStatus.UNSUPPORTED_MEDIA_TYPE;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(
      ...buildArgs(ErrorsEnum.UNSUPPORTED_MEDIA_TYPE, internalMessage, options),
    );
  }
}

/**
 * Use when the server understands the content type of the request entity, but was unable to process the contained instructions.
 */
export class UnprocessableEntityError extends DefaultErrorBase(
  UnprocessableEntityException,
) {
  static defaultStatusCode = HttpStatus.UNPROCESSABLE_ENTITY;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(
      ...buildArgs(ErrorsEnum.UNPROCESSABLE_ENTITY, internalMessage, options),
    );
  }
}

/**
 * Use when the user has sent too many requests in a given amount of time ("rate limiting").
 */
export class TooManyRequestsError extends DefaultErrorBase(HttpException) {
  static defaultStatusCode = HttpStatus.TOO_MANY_REQUESTS;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(
      ...buildArgsHttpException(
        ErrorsEnum.TOO_MANY_REQUESTS,
        internalMessage,
        options,
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
  }
}

/**
 * Use when the server does not support the functionality required to fulfill the request.
 */
export class NotImplementedError extends DefaultErrorBase(
  NotImplementedException,
) {
  static defaultStatusCode = HttpStatus.NOT_IMPLEMENTED;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.NOT_IMPLEMENTED, internalMessage, options));
  }
}

/**
 * Use when the server, while acting as a gateway or proxy, received an invalid response from the upstream server.
 */
export class BadGatewayError extends DefaultErrorBase(BadGatewayException) {
  static defaultStatusCode = HttpStatus.BAD_GATEWAY;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.BAD_GATEWAY, internalMessage, options));
  }
}

/**
 * Use when the server is currently unavailable (because it is overloaded or down for maintenance).
 */
export class ServiceUnavailableError extends DefaultErrorBase(
  ServiceUnavailableException,
) {
  static defaultStatusCode = HttpStatus.SERVICE_UNAVAILABLE;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(
      ...buildArgs(ErrorsEnum.SERVICE_UNAVAILABLE, internalMessage, options),
    );
  }
}

/**
 * Use when the server, while acting as a gateway or proxy, did not receive a timely response from the upstream server or some other auxiliary server.
 */
export class GatewayTimeoutError extends DefaultErrorBase(
  GatewayTimeoutException,
) {
  static defaultStatusCode = HttpStatus.GATEWAY_TIMEOUT;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.GATEWAY_TIMEOUT, internalMessage, options));
  }
}

/**
 * Custom
 */

export class AdditionalVerificationNeededError extends DefaultErrorBase(
  HttpException,
) {
  static defaultStatusCode: any = HttpStatusCode.UnavailableForLegalReasons;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(
      ...buildArgsHttpException(
        ErrorsEnum.UNAVAILABLE_FOR_LEGAL_REASONS,
        internalMessage,
        options,
        AdditionalVerificationNeededError.defaultStatusCode,
      ),
    );
  }
}

export class LoginError extends DefaultErrorBase(UnauthorizedException) {
  static defaultStatusCode = HttpStatus.UNAUTHORIZED;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.BAD_LOGIN, internalMessage, options));
  }
}

export class InputValidationError extends DefaultErrorBase(
  BadRequestException,
) {
  static defaultStatusCode = HttpStatus.BAD_REQUEST;
  constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions) {
    super(...buildArgs(ErrorsEnum.INVALID_VALUE, internalMessage, options));
  }
}
