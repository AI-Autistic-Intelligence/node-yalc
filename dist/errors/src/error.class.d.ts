import { HttpException } from './http.exception.js';
import { HttpStatus } from './http-status.enum.js';
import { IDefaultErrorBaseOptions } from './default.error.js';
export declare function createHttpException(status: number): {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
declare const BadRequestException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class BadRequestException extends BadRequestException_base {
}
declare const UnauthorizedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class UnauthorizedException extends UnauthorizedException_base {
}
declare const ForbiddenException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class ForbiddenException extends ForbiddenException_base {
}
declare const NotFoundException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class NotFoundException extends NotFoundException_base {
}
declare const ConflictException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class ConflictException extends ConflictException_base {
}
declare const InternalServerErrorException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class InternalServerErrorException extends InternalServerErrorException_base {
}
declare const MethodNotAllowedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class MethodNotAllowedException extends MethodNotAllowedException_base {
}
declare const NotAcceptableException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class NotAcceptableException extends NotAcceptableException_base {
}
declare const GoneException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class GoneException extends GoneException_base {
}
declare const UnsupportedMediaTypeException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class UnsupportedMediaTypeException extends UnsupportedMediaTypeException_base {
}
declare const UnprocessableEntityException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class UnprocessableEntityException extends UnprocessableEntityException_base {
}
declare const NotImplementedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class NotImplementedException extends NotImplementedException_base {
}
declare const BadGatewayException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class BadGatewayException extends BadGatewayException_base {
}
declare const ServiceUnavailableException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class ServiceUnavailableException extends ServiceUnavailableException_base {
}
declare const GatewayTimeoutException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class GatewayTimeoutException extends GatewayTimeoutException_base {
}
declare const MisdirectedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class MisdirectedException extends MisdirectedException_base {
}
declare const PayloadTooLargeException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class PayloadTooLargeException extends PayloadTooLargeException_base {
}
declare const PreconditionFailedException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class PreconditionFailedException extends PreconditionFailedException_base {
}
declare const RequestTimeoutException_base: {
    new (objectOrError?: string | object | any, descriptionOrOptions?: string | HttpExceptionOptions): {
        readonly response: string | Record<string, any>;
        readonly status: number;
        readonly options?: Record<string, any>;
        initMessage(): void;
        initName(): void;
        getResponse(): string | object;
        getStatus(): number;
        name: string;
        message: string;
        stack?: string;
        cause?: unknown;
    };
    createBody(objectOrError: object | string, description?: string, statusCode?: number): object;
    captureStackTrace(targetObject: object, constructorOpt?: Function): void;
    prepareStackTrace(err: Error, stackTraces: NodeJS.CallSite[]): any;
    stackTraceLimit: number;
};
export declare class RequestTimeoutException extends RequestTimeoutException_base {
}
export interface HttpExceptionOptions {
    cause?: Error;
    description?: string;
}
export declare const httpExceptionStatusCodes: Record<string, number>;
declare const BadRequestError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof BadRequestException>;
export declare class BadRequestError extends BadRequestError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnauthorizedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnauthorizedException>;
export declare class UnauthorizedError extends UnauthorizedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ForbiddenError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ForbiddenException>;
export declare class ForbiddenError extends ForbiddenError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotFoundError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotFoundException>;
export declare class NotFoundError extends NotFoundError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ConflictError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ConflictException>;
export declare class ConflictError extends ConflictError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const InternalServerError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof InternalServerErrorException>;
export declare class InternalServerError extends InternalServerError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const PaymentRequiredError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
export declare class PaymentRequiredError extends PaymentRequiredError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const MethodNotAllowedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof MethodNotAllowedException>;
export declare class MethodNotAllowedError extends MethodNotAllowedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotAcceptableError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotAcceptableException>;
export declare class NotAcceptableError extends NotAcceptableError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const GoneError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof GoneException>;
export declare class GoneError extends GoneError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnsupportedMediaTypeError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnsupportedMediaTypeException>;
export declare class UnsupportedMediaTypeError extends UnsupportedMediaTypeError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const UnprocessableEntityError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof UnprocessableEntityException>;
export declare class UnprocessableEntityError extends UnprocessableEntityError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const TooManyRequestsError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
export declare class TooManyRequestsError extends TooManyRequestsError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const NotImplementedError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof NotImplementedException>;
export declare class NotImplementedError extends NotImplementedError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const BadGatewayError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof BadGatewayException>;
export declare class BadGatewayError extends BadGatewayError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const ServiceUnavailableError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof ServiceUnavailableException>;
export declare class ServiceUnavailableError extends ServiceUnavailableError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const GatewayTimeoutError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof GatewayTimeoutException>;
export declare class GatewayTimeoutError extends GatewayTimeoutError_base {
    static defaultStatusCode: HttpStatus;
    constructor(internalMessage?: string, options?: IDefaultErrorBaseOptions);
}
declare const AdditionalVerificationNeededError_base: import("./default.error.js").IDefaultErrorBaseConstructor<typeof HttpException>;
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
