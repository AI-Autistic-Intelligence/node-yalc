type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
import { type IEventOptions, type IErrorEventOptions, type IErrorEventOptionsRequired, type EventReturnType } from './event.js';
import { type ImprovedLoggerService } from '@node-yalc/logger';
import { EventNameFormatter } from './emitter.js';
import { DefaultError } from '@node-yalc/errors';
import { BadGatewayError, BadRequestError, ConflictError, ForbiddenError, GatewayTimeoutError, GoneError, InternalServerError, MethodNotAllowedError, NotAcceptableError, NotFoundError, NotImplementedError, PaymentRequiredError, ServiceUnavailableError, TooManyRequestsError, UnauthorizedError, UnprocessableEntityError, UnsupportedMediaTypeError } from '@node-yalc/errors';
import type { ClassType } from '@node-yalc/types';
import { Err } from 'neverthrow';
import { type PromiseResult } from './event-result.types.js';
export interface IEventServiceOptions<TFormatter extends EventNameFormatter = EventNameFormatter> {
    formatter?: TFormatter;
}
export type IErrorBasedMethodOptions<TErrorOptions> = Omit<TErrorOptions, 'errorClass'>;
/**
 * Helper to inject a trace into the options object if it's not already set.
 */
export declare function injectTrace<T extends IEventOptions>(options?: T): T | undefined;
export declare class YalcEventService<TFormatter extends EventNameFormatter = EventNameFormatter, TEventOptions extends IEventOptions<TFormatter> = IEventOptions<TFormatter>, TErrorOptions extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>> {
    protected readonly loggerService: ImprovedLoggerService;
    protected readonly eventEmitter: import('eventemitter2').EventEmitter2;
    protected options?: any;
    constructor(loggerService: ImprovedLoggerService, eventEmitter: import('eventemitter2').EventEmitter2, options?: any);
    get logger(): ImprovedLoggerService;
    get emitter(): import('eventemitter2').EventEmitter2;
    /**
     * Alias for log
     */
    emit: (eventName: Parameters<TFormatter> | string, options?: TEventOptions) => EventReturnType<TEventOptions>;
    emitAsync: (eventName: Parameters<TFormatter> | string, options?: TEventOptions) => Promise<EventReturnType<TEventOptions>>;
    /**
     * We do not expose it because the types might be too widely open and allow arbitrary properties, therefore mistakes
     */
    protected _error<TOpts extends IErrorEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOpts): any;
    logAsync(eventName: Parameters<TFormatter> | string, options?: TEventOptions): Promise<EventReturnType<TEventOptions>>;
    protected _errorAsync<TOpts extends IErrorEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOpts): Promise<any>;
    error(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): any;
    /**
     * Use this method to return an Error variant of ResultAsync with a DefaultError.
     */
    errorResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, DefaultError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a DefaultError.
     */
    errorFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T>;
    errorAsync(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Promise<any>;
    warnAsync(eventName: Parameters<TFormatter> | string, options?: TEventOptions): Promise<EventReturnType<TEventOptions>>;
    debugAsync(eventName: Parameters<TFormatter> | string, options?: TEventOptions): Promise<EventReturnType<TEventOptions>>;
    verboseAsync(eventName: Parameters<TFormatter> | string, options?: TEventOptions): Promise<EventReturnType<TEventOptions>>;
    log(eventName: Parameters<TFormatter> | string, options?: TEventOptions): EventReturnType<TEventOptions>;
    warn(eventName: Parameters<TFormatter> | string, options?: TEventOptions): EventReturnType<TEventOptions>;
    debug(eventName: Parameters<TFormatter> | string, options?: TEventOptions): EventReturnType<TEventOptions>;
    verbose(eventName: Parameters<TFormatter> | string, options?: TEventOptions): EventReturnType<TEventOptions>;
    /**
     * Use this method to throw an error with arbitrary status code. 500 by default.
     */
    errorHttp(eventName: Parameters<TFormatter> | string, errorCode: number, options?: TErrorOptions): DefaultError;
    errorHttpResult(eventName: Parameters<TFormatter> | string, errorCode: number, options?: TErrorOptions): Err<never, DefaultError>;
    /**
     * Use this method to proxy an error generated somewhere else. Very useful with try{} catch{} blocks.
     * Where you do not want to change the nature of the error, but you want to forward it instead.
     *
     * NOTE: data property is deep-merged with the error data, with precedence to the errorForward data.
     */
    errorForward<TError extends DefaultError>(eventName: Parameters<TFormatter> | string, error: Error | TError, options?: IErrorBasedMethodOptions<TErrorOptions>): TError;
    /**
     * Use this method to forward an error and return an error variant of ResultAsync object.
     */
    errorForwardResult<TError extends DefaultError>(eventName: Parameters<TFormatter> | string, error: Error | TError, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, TError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error will be forwarded from the promise, with extra options added.
     * If the error is not a subtype of DefaultError, it will be converted to a DefaultError.
     */
    errorForwardFromFn<T, E extends DefaultError = DefaultError>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, E>;
    /**
     * Use this method to throw a 400 Bad Request error when the request could not be understood or was missing required parameters.
     */
    errorBadRequest(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): BadRequestError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a BadRequestError representing a 400 Bad Request error.
     */
    errorBadRequestResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, BadRequestError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a BadRequestError representing a 400 Bad Request error.
     */
    errorBadRequestFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, BadRequestError>;
    /**
     * Use this method to throw a 401 Unauthorized error when authentication is required and has failed or has not yet been provided.
     */
    errorUnauthorized(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): UnauthorizedError;
    /**
     * Use this method to construct an Error variant of ResultAsync with an UnauthorizedError representing a 401 Unauthorized error.
     */
    errorUnauthorizedResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, UnauthorizedError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be an UnauthorizedError representing a 401 Unauthorized error.
     */
    errorUnauthorizedFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, UnauthorizedError>;
    /**
     * Use this method to throw a 402 Payment Required error. This status code is reserved for future use.
     */
    errorPaymentRequired(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): PaymentRequiredError;
    /**
     * Use this method to throw a 403 Forbidden error when the client does not have access rights to the content.
     */
    errorForbidden(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): ForbiddenError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a ForbiddenError representing a 403 Forbidden error.
     */
    errorForbiddenResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, ForbiddenError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a ForbiddenError representing a 403 Forbidden error.
     */
    errorForbiddenFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, ForbiddenError>;
    /**
     * Use this method to throw a 404 Not Found error when the server can not find the requested resource.
     */
    errorNotFound(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): NotFoundError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a NotFoundError representing a 404 Not Found error.
     */
    errorNotFoundResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, NotFoundError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a NotFoundError representing a 404 Not Found error.
     */
    errorNotFoundFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, NotFoundError>;
    /**
     * Use this method to throw a 405 Method Not Allowed error when the HTTP method is not supported for the requested resource.
     */
    errorMethodNotAllowed(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): MethodNotAllowedError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a MethodNotAllowedError representing a 405 Method Not Allowed error.
     */
    errorMethodNotAllowedResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, MethodNotAllowedError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a MethodNotAllowedError representing a 405 Method Not Allowed error.
     */
    errorMethodNotAllowedFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, MethodNotAllowedError>;
    /**
     * Use this method to throw a 406 Not Acceptable error when the server cannot produce a response matching the list of acceptable values defined in the request's headers.
     */
    errorNotAcceptable(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): NotAcceptableError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a NotAcceptableError representing a 406 Not Acceptable error.
     */
    errorNotAcceptableResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, NotAcceptableError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a NotAcceptableError representing a 406 Not Acceptable error.
     */
    errorNotAcceptableFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, NotAcceptableError>;
    /**
     * Use this method to throw a 409 Conflict error when the request could not be completed due to a conflict with the current state of the target resource.
     */
    errorConflict(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): ConflictError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a ConflictError representing a 409 Conflict error.
     */
    errorConflictResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, ConflictError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a ConflictError representing a 409 Conflict error.
     */
    errorConflictFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, ConflictError>;
    /**
     * Use this method to throw a 410 Gone error when the target resource is no longer available at the origin server and no forwarding address is known.
     */
    errorGone(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): GoneError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a GoneError representing a 410 Gone error.
     */
    errorGoneResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, GoneError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a GoneError representing a 410 Gone error.
     */
    errorGoneFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, GoneError>;
    /**
     * Use this method to throw a 415 Unsupported Media Type error when the request entity has a media type which the server or resource does not support.
     */
    errorUnsupportedMediaType(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): UnsupportedMediaTypeError;
    /**
     * Use this method to construct an Error variant of ResultAsync with an UnsupportedMediaTypeError representing a 415 Unsupported Media Type error.
     */
    errorUnsupportedMediaTypeResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, UnsupportedMediaTypeError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be an UnsupportedMediaTypeError representing a 415 Unsupported Media Type error.
     */
    errorUnsupportedMediaTypeFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, UnsupportedMediaTypeError>;
    /**
     * Use this method to throw a 422 Unprocessable Entity error when the server understands the content type of the request entity, but was unable to process the contained instructions.
     */
    errorUnprocessableEntity(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): UnprocessableEntityError;
    /**
     * Use this method to construct an Error variant of ResultAsync with an UnprocessableEntityError representing a 422 Unprocessable Entity error.
     */
    errorUnprocessableEntityResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, UnprocessableEntityError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be an UnprocessableEntityError representing a 422 Unprocessable Entity error.
     */
    errorUnprocessableEntityFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, UnprocessableEntityError>;
    /**
     * Use this method to throw a 429 Too Many Requests error when the user has sent too many requests in a given amount of time.
     */
    errorTooManyRequests(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): TooManyRequestsError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a TooManyRequestsError representing a 429 Too Many Requests error.
     */
    errorTooManyRequestsResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, TooManyRequestsError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a TooManyRequestsError representing a 429 Too Many Requests error.
     */
    errorTooManyRequestsFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, TooManyRequestsError>;
    /**
     * Use this method to throw a 500 Internal Server Error when the server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    errorInternalServerError(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): InternalServerError;
    /**
     * Use this method to construct an Error variant of ResultAsync with an InternalServerError representing a 500 Internal Server Error error.
     */
    errorInternalServerErrorResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, InternalServerError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be an InternalServerError representing a 500 Internal Server Error error.
     */
    errorInternalServerErrorFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, InternalServerError>;
    /**
     * Use this method to throw a 501 Not Implemented error when the server does not support the functionality required to fulfill the request.
     */
    errorNotImplemented(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): NotImplementedError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a NotImplementedError representing a 501 Not Implemented error.
     */
    errorNotImplementedResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, NotImplementedError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a NotImplementedError representing a 501 Not Implemented error.
     */
    errorNotImplementedFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, NotImplementedError>;
    /**
     * Use this method to throw a 502 Bad Gateway error when one server on the internet received an invalid response from another server.
     */
    errorBadGateway(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): BadGatewayError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a BadGatewayError representing a 502 Bad Gateway error.
     */
    errorBadGatewayResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, BadGatewayError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a BadGatewayError representing a 502 Bad Gateway error.
     */
    errorBadGatewayFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, BadGatewayError>;
    /**
     * Use this method to throw a 503 Service Unavailable error when the server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.
     */
    errorServiceUnavailable(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): ServiceUnavailableError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a ServiceUnavailableError representing a 503 Service Unavailable error.
     */
    errorServiceUnavailableResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, ServiceUnavailableError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a ServiceUnavailableError representing a 503 Service Unavailable error.
     */
    errorServiceUnavailableFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, ServiceUnavailableError>;
    /**
     * Use this method to throw a 504 Gateway Timeout error when one server did not receive a timely response from another server or some other auxiliary server it needed to access to complete the request.
     */
    errorGatewayTimeout(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): GatewayTimeoutError;
    /**
     * Use this method to construct an Error variant of ResultAsync with a GatewayTimeoutError representing a 504 Gateway Timeout error.
     */
    errorGatewayTimeoutResult(eventName: Parameters<TFormatter> | string, options?: IErrorBasedMethodOptions<TErrorOptions>): Err<never, GatewayTimeoutError>;
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a GatewayTimeoutError representing a 504 Gateway Timeout error.
     */
    errorGatewayTimeoutFromFn<T>(eventName: Parameters<TFormatter> | string, cb: () => PromiseLike<T> | T, options?: IErrorBasedMethodOptions<TErrorOptions>): PromiseResult<T, GatewayTimeoutError>;
    protected getLoggerLevelByOptions(options: IErrorEventOptions<TFormatter>): "error" | "log" | "warn" | import("@node-yalc/logger").LogLevelEnum.LOG | import("@node-yalc/logger").LogLevelEnum.ERROR;
    protected applyLoggerLevel<TOpt extends IEventOptions<TFormatter> | IErrorEventOptions<TFormatter>>(options: TOpt, level: LogLevel): TOpt;
    protected applyLoggerLevelByStatus<TOpts extends IErrorEventOptions<TFormatter>>(options: TOpts, error: DefaultError): TOpts;
    protected applyLoggerLevelByError<TOpts extends IErrorEventOptions<TFormatter> | IEventOptions<TFormatter>>(options: TOpts): TOpts;
    /**
     * Use this method to apply a Error instance to an options object.
     */
    protected applyCause<TOpts extends IErrorEventOptions<TFormatter>>(cause: unknown, options?: TOpts): TOpts;
    /**
     * Merges the methods options with the constructor options.
     */
    protected buildOptions<TOpts extends IErrorEventOptions<TFormatter> | IEventOptions<TFormatter>>(options?: TOpts): TOpts;
    protected buildErrorOptions<TErrorClass extends DefaultError = DefaultError>(options?: IErrorEventOptions<TFormatter>, defaultClass?: ClassType<TErrorClass> | TErrorClass | boolean): IErrorEventOptionsRequired<TFormatter, TErrorClass>;
}
export {};
