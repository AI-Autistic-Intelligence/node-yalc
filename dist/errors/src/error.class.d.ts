import { HttpException } from './http.exception.js';
import { HttpStatus } from './http-status.enum.js';
import { IDefaultErrorBaseOptions } from './default.error.js';
export declare function createHttpException(status: number): {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
declare const BadRequestException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class BadRequestException extends BadRequestException_base {
}
declare const UnauthorizedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class UnauthorizedException extends UnauthorizedException_base {
}
declare const ForbiddenException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class ForbiddenException extends ForbiddenException_base {
}
declare const NotFoundException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class NotFoundException extends NotFoundException_base {
}
declare const ConflictException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class ConflictException extends ConflictException_base {
}
declare const InternalServerErrorException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class InternalServerErrorException extends InternalServerErrorException_base {
}
declare const MethodNotAllowedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class MethodNotAllowedException extends MethodNotAllowedException_base {
}
declare const NotAcceptableException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class NotAcceptableException extends NotAcceptableException_base {
}
declare const GoneException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class GoneException extends GoneException_base {
}
declare const UnsupportedMediaTypeException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class UnsupportedMediaTypeException extends UnsupportedMediaTypeException_base {
}
declare const UnprocessableEntityException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class UnprocessableEntityException extends UnprocessableEntityException_base {
}
declare const NotImplementedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class NotImplementedException extends NotImplementedException_base {
}
declare const BadGatewayException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class BadGatewayException extends BadGatewayException_base {
}
declare const ServiceUnavailableException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class ServiceUnavailableException extends ServiceUnavailableException_base {
}
declare const GatewayTimeoutException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class GatewayTimeoutException extends GatewayTimeoutException_base {
}
declare const MisdirectedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class MisdirectedException extends MisdirectedException_base {
}
declare const PayloadTooLargeException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class PayloadTooLargeException extends PayloadTooLargeException_base {
}
declare const PreconditionFailedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class PreconditionFailedException extends PreconditionFailedException_base {
}
declare const RequestTimeoutException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
    };
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
};
export declare class RequestTimeoutException extends RequestTimeoutException_base {
}
export interface HttpExceptionOptions {
    cause?: Error;
    description?: string;
}
export declare const httpExceptionStatusCodes: Record<string, number>;
declare const BadRequestError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof BadRequestException>;
/**
 * Use when the request could not be understood or was missing required parameters.
 */
export declare class BadRequestError extends BadRequestError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnauthorizedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnauthorizedException>;
/**
 * Use when authentication failed or the user does not have permissions for the desired action.
 */
export declare class UnauthorizedError extends UnauthorizedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ForbiddenError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ForbiddenException>;
/**
 * Use when the authenticated user does not have access to the requested resource.
 */
export declare class ForbiddenError extends ForbiddenError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotFoundError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotFoundException>;
/**
 * Use when the requested resource could not be found.
 */
export declare class NotFoundError extends NotFoundError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ConflictError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ConflictException>;
/**
 * Use when the request could not be completed due to a conflict with the current state of the target resource.
 */
export declare class ConflictError extends ConflictError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const InternalServerError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof InternalServerErrorException>;
/**
 * Use when an unexpected error occurred on the server side.
 */
export declare class InternalServerError extends InternalServerError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const PaymentRequiredError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
/**
 * Reserved for future use; its utilization is not common.
 */
export declare class PaymentRequiredError extends PaymentRequiredError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const MethodNotAllowedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof MethodNotAllowedException>;
/**
 * Use when an unsupported HTTP method was used for the request.
 */
export declare class MethodNotAllowedError extends MethodNotAllowedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotAcceptableError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotAcceptableException>;
/**
 * Use when the server cannot produce a response matching the list of acceptable values defined in the request's headers.
 */
export declare class NotAcceptableError extends NotAcceptableError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const GoneError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof GoneException>;
/**
 * Use when the requested resource has been permanently deleted and will not be available again.
 */
export declare class GoneError extends GoneError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnsupportedMediaTypeError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnsupportedMediaTypeException>;
/**
 * Use when the request entity has a media type which the server or resource does not support.
 */
export declare class UnsupportedMediaTypeError extends UnsupportedMediaTypeError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnprocessableEntityError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnprocessableEntityException>;
/**
 * Use when the server understands the content type of the request entity, but was unable to process the contained instructions.
 */
export declare class UnprocessableEntityError extends UnprocessableEntityError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const TooManyRequestsError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
/**
 * Use when the user has sent too many requests in a given amount of time ("rate limiting").
 */
export declare class TooManyRequestsError extends TooManyRequestsError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotImplementedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotImplementedException>;
/**
 * Use when the server does not support the functionality required to fulfill the request.
 */
export declare class NotImplementedError extends NotImplementedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const BadGatewayError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof BadGatewayException>;
/**
 * Use when the server, while acting as a gateway or proxy, received an invalid response from the upstream server.
 */
export declare class BadGatewayError extends BadGatewayError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ServiceUnavailableError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ServiceUnavailableException>;
/**
 * Use when the server is currently unavailable (because it is overloaded or down for maintenance).
 */
export declare class ServiceUnavailableError extends ServiceUnavailableError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const GatewayTimeoutError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof GatewayTimeoutException>;
/**
 * Use when the server, while acting as a gateway or proxy, did not receive a timely response from the upstream server or some other auxiliary server.
 */
export declare class GatewayTimeoutError extends GatewayTimeoutError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const AdditionalVerificationNeededError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
/**
 * Custom
 */
export declare class AdditionalVerificationNeededError extends AdditionalVerificationNeededError_base {
    static defaultStatusCode: any;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const LoginError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnauthorizedException>;
export declare class LoginError extends LoginError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const InputValidationError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof BadRequestException>;
export declare class InputValidationError extends InputValidationError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
export {};
