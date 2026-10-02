"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationError = exports.LoginError = exports.AdditionalVerificationNeededError = exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.BadGatewayError = exports.NotImplementedError = exports.TooManyRequestsError = exports.UnprocessableEntityError = exports.UnsupportedMediaTypeError = exports.GoneError = exports.NotAcceptableError = exports.MethodNotAllowedError = exports.PaymentRequiredError = exports.InternalServerError = exports.ConflictError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.httpExceptionStatusCodes = exports.RequestTimeoutException = exports.PreconditionFailedException = exports.PayloadTooLargeException = exports.MisdirectedException = exports.GatewayTimeoutException = exports.ServiceUnavailableException = exports.BadGatewayException = exports.NotImplementedException = exports.UnprocessableEntityException = exports.UnsupportedMediaTypeException = exports.GoneException = exports.NotAcceptableException = exports.MethodNotAllowedException = exports.InternalServerErrorException = exports.ConflictException = exports.NotFoundException = exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = void 0;
exports.createHttpException = createHttpException;
const http_exception_js_1 = require("./http.exception.js");
const http_status_enum_js_1 = require("./http-status.enum.js");
const error_enum_js_1 = require("./error.enum.js");
const default_error_js_1 = require("./default.error.js");
const axios_1 = require("axios");
function createHttpException(status) {
    return class extends http_exception_js_1.HttpException {
        constructor(objectOrError, descriptionOrOptions) {
            super(http_exception_js_1.HttpException.createBody(objectOrError, typeof descriptionOrOptions === 'string' ? descriptionOrOptions : descriptionOrOptions?.description, status), status, typeof descriptionOrOptions !== 'string' ? descriptionOrOptions : undefined);
        }
    };
}
class BadRequestException extends createHttpException(http_status_enum_js_1.HttpStatus.BAD_REQUEST) {
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends createHttpException(http_status_enum_js_1.HttpStatus.UNAUTHORIZED) {
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends createHttpException(http_status_enum_js_1.HttpStatus.FORBIDDEN) {
}
exports.ForbiddenException = ForbiddenException;
class NotFoundException extends createHttpException(http_status_enum_js_1.HttpStatus.NOT_FOUND) {
}
exports.NotFoundException = NotFoundException;
class ConflictException extends createHttpException(http_status_enum_js_1.HttpStatus.CONFLICT) {
}
exports.ConflictException = ConflictException;
class InternalServerErrorException extends createHttpException(http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR) {
}
exports.InternalServerErrorException = InternalServerErrorException;
class MethodNotAllowedException extends createHttpException(http_status_enum_js_1.HttpStatus.METHOD_NOT_ALLOWED) {
}
exports.MethodNotAllowedException = MethodNotAllowedException;
class NotAcceptableException extends createHttpException(http_status_enum_js_1.HttpStatus.NOT_ACCEPTABLE) {
}
exports.NotAcceptableException = NotAcceptableException;
class GoneException extends createHttpException(http_status_enum_js_1.HttpStatus.GONE) {
}
exports.GoneException = GoneException;
class UnsupportedMediaTypeException extends createHttpException(http_status_enum_js_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE) {
}
exports.UnsupportedMediaTypeException = UnsupportedMediaTypeException;
class UnprocessableEntityException extends createHttpException(http_status_enum_js_1.HttpStatus.UNPROCESSABLE_ENTITY) {
}
exports.UnprocessableEntityException = UnprocessableEntityException;
class NotImplementedException extends createHttpException(http_status_enum_js_1.HttpStatus.NOT_IMPLEMENTED) {
}
exports.NotImplementedException = NotImplementedException;
class BadGatewayException extends createHttpException(http_status_enum_js_1.HttpStatus.BAD_GATEWAY) {
}
exports.BadGatewayException = BadGatewayException;
class ServiceUnavailableException extends createHttpException(http_status_enum_js_1.HttpStatus.SERVICE_UNAVAILABLE) {
}
exports.ServiceUnavailableException = ServiceUnavailableException;
class GatewayTimeoutException extends createHttpException(http_status_enum_js_1.HttpStatus.GATEWAY_TIMEOUT) {
}
exports.GatewayTimeoutException = GatewayTimeoutException;
class MisdirectedException extends createHttpException(http_status_enum_js_1.HttpStatus.MISDIRECTED) {
}
exports.MisdirectedException = MisdirectedException;
class PayloadTooLargeException extends createHttpException(http_status_enum_js_1.HttpStatus.PAYLOAD_TOO_LARGE) {
}
exports.PayloadTooLargeException = PayloadTooLargeException;
class PreconditionFailedException extends createHttpException(http_status_enum_js_1.HttpStatus.PRECONDITION_FAILED) {
}
exports.PreconditionFailedException = PreconditionFailedException;
class RequestTimeoutException extends createHttpException(http_status_enum_js_1.HttpStatus.REQUEST_TIMEOUT) {
}
exports.RequestTimeoutException = RequestTimeoutException;
exports.httpExceptionStatusCodes = {
    [BadRequestException.name]: http_status_enum_js_1.HttpStatus.BAD_REQUEST,
    [UnauthorizedException.name]: http_status_enum_js_1.HttpStatus.UNAUTHORIZED,
    [ForbiddenException.name]: http_status_enum_js_1.HttpStatus.FORBIDDEN,
    [NotFoundException.name]: http_status_enum_js_1.HttpStatus.NOT_FOUND,
    [MethodNotAllowedException.name]: http_status_enum_js_1.HttpStatus.METHOD_NOT_ALLOWED,
    [NotAcceptableException.name]: http_status_enum_js_1.HttpStatus.NOT_ACCEPTABLE,
    [RequestTimeoutException.name]: http_status_enum_js_1.HttpStatus.REQUEST_TIMEOUT,
    [ConflictException.name]: http_status_enum_js_1.HttpStatus.CONFLICT,
    [GoneException.name]: http_status_enum_js_1.HttpStatus.GONE,
    [PreconditionFailedException.name]: http_status_enum_js_1.HttpStatus.PRECONDITION_FAILED,
    [PayloadTooLargeException.name]: http_status_enum_js_1.HttpStatus.PAYLOAD_TOO_LARGE,
    [UnsupportedMediaTypeException.name]: http_status_enum_js_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE,
    [UnprocessableEntityException.name]: http_status_enum_js_1.HttpStatus.UNPROCESSABLE_ENTITY,
    [InternalServerErrorException.name]: http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR,
    [NotImplementedException.name]: http_status_enum_js_1.HttpStatus.NOT_IMPLEMENTED,
    [BadGatewayException.name]: http_status_enum_js_1.HttpStatus.BAD_GATEWAY,
    [ServiceUnavailableException.name]: http_status_enum_js_1.HttpStatus.SERVICE_UNAVAILABLE,
    [GatewayTimeoutException.name]: http_status_enum_js_1.HttpStatus.GATEWAY_TIMEOUT,
    [http_exception_js_1.HttpException.name]: http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR,
    [MisdirectedException.name]: http_status_enum_js_1.HttpStatus.MISDIRECTED,
};
function buildArgs(errorName, internalMessage, options) {
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
function buildArgsHttpException(errorName, internalMessage, options, errorCode) {
    const args = buildArgs(errorName, internalMessage, options);
    return [
        args[0],
        args[1],
        args[2],
        errorCode ?? http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR,
        typeof args[3] === 'string' ? { description: args[3] } : args[3],
    ];
}
class BadRequestError extends (0, default_error_js_1.DefaultErrorBase)(BadRequestException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.BAD_REQUEST; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_REQUEST, internalMessage, options));
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends (0, default_error_js_1.DefaultErrorBase)(UnauthorizedException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.UNAUTHORIZED; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNAUTHORIZED, internalMessage, options));
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends (0, default_error_js_1.DefaultErrorBase)(ForbiddenException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.FORBIDDEN; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.FORBIDDEN, internalMessage, options));
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends (0, default_error_js_1.DefaultErrorBase)(NotFoundException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.NOT_FOUND; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_FOUND, internalMessage, options));
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends (0, default_error_js_1.DefaultErrorBase)(ConflictException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.CONFLICT; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.CONFLICT, internalMessage, options));
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends (0, default_error_js_1.DefaultErrorBase)(InternalServerErrorException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.INTERNAL_SERVER_ERROR, internalMessage, options));
    }
}
exports.InternalServerError = InternalServerError;
class PaymentRequiredError extends (0, default_error_js_1.DefaultErrorBase)(http_exception_js_1.HttpException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.PAYMENT_REQUIRED; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.PAYMENT_REQUIRED, internalMessage, options, PaymentRequiredError.defaultStatusCode));
    }
}
exports.PaymentRequiredError = PaymentRequiredError;
class MethodNotAllowedError extends (0, default_error_js_1.DefaultErrorBase)(MethodNotAllowedException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.METHOD_NOT_ALLOWED; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.METHOD_NOT_ALLOWED, internalMessage, options));
    }
}
exports.MethodNotAllowedError = MethodNotAllowedError;
class NotAcceptableError extends (0, default_error_js_1.DefaultErrorBase)(NotAcceptableException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.NOT_ACCEPTABLE; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_ACCEPTABLE, internalMessage, options));
    }
}
exports.NotAcceptableError = NotAcceptableError;
class GoneError extends (0, default_error_js_1.DefaultErrorBase)(GoneException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.GONE; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.GONE, internalMessage, options));
    }
}
exports.GoneError = GoneError;
class UnsupportedMediaTypeError extends (0, default_error_js_1.DefaultErrorBase)(UnsupportedMediaTypeException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNSUPPORTED_MEDIA_TYPE, internalMessage, options));
    }
}
exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
class UnprocessableEntityError extends (0, default_error_js_1.DefaultErrorBase)(UnprocessableEntityException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.UNPROCESSABLE_ENTITY; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.UNPROCESSABLE_ENTITY, internalMessage, options));
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
class TooManyRequestsError extends (0, default_error_js_1.DefaultErrorBase)(http_exception_js_1.HttpException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.TOO_MANY_REQUESTS; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.TOO_MANY_REQUESTS, internalMessage, options, http_status_enum_js_1.HttpStatus.TOO_MANY_REQUESTS));
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class NotImplementedError extends (0, default_error_js_1.DefaultErrorBase)(NotImplementedException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.NOT_IMPLEMENTED; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.NOT_IMPLEMENTED, internalMessage, options));
    }
}
exports.NotImplementedError = NotImplementedError;
class BadGatewayError extends (0, default_error_js_1.DefaultErrorBase)(BadGatewayException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.BAD_GATEWAY; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_GATEWAY, internalMessage, options));
    }
}
exports.BadGatewayError = BadGatewayError;
class ServiceUnavailableError extends (0, default_error_js_1.DefaultErrorBase)(ServiceUnavailableException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.SERVICE_UNAVAILABLE; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.SERVICE_UNAVAILABLE, internalMessage, options));
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
class GatewayTimeoutError extends (0, default_error_js_1.DefaultErrorBase)(GatewayTimeoutException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.GATEWAY_TIMEOUT; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.GATEWAY_TIMEOUT, internalMessage, options));
    }
}
exports.GatewayTimeoutError = GatewayTimeoutError;
class AdditionalVerificationNeededError extends (0, default_error_js_1.DefaultErrorBase)(http_exception_js_1.HttpException) {
    static { this.defaultStatusCode = axios_1.HttpStatusCode.UnavailableForLegalReasons; }
    constructor(internalMessage, options) {
        super(...buildArgsHttpException(error_enum_js_1.ErrorsEnum.UNAVAILABLE_FOR_LEGAL_REASONS, internalMessage, options, AdditionalVerificationNeededError.defaultStatusCode));
    }
}
exports.AdditionalVerificationNeededError = AdditionalVerificationNeededError;
class LoginError extends (0, default_error_js_1.DefaultErrorBase)(UnauthorizedException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.UNAUTHORIZED; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.BAD_LOGIN, internalMessage, options));
    }
}
exports.LoginError = LoginError;
class InputValidationError extends (0, default_error_js_1.DefaultErrorBase)(BadRequestException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.BAD_REQUEST; }
    constructor(internalMessage, options) {
        super(...buildArgs(error_enum_js_1.ErrorsEnum.INVALID_VALUE, internalMessage, options));
    }
}
exports.InputValidationError = InputValidationError;
//# sourceMappingURL=error.class.js.map