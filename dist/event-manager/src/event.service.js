import { eventLogAsync, eventDebugAsync, eventErrorAsync, eventVerboseAsync, eventWarnAsync, eventDebug, eventError, eventLog, eventVerbose, eventWarn, applyAwaitOption, isErrorOptions, resolveLoggerOption, } from './event.js';
import { errorToDefaultError, formatCause, } from '@node-yalc/errors';
import { BadGatewayError, BadRequestError, ConflictError, ForbiddenError, GatewayTimeoutError, GoneError, InternalServerError, MethodNotAllowedError, NotAcceptableError, NotFoundError, NotImplementedError, PaymentRequiredError, ServiceUnavailableError, TooManyRequestsError, UnauthorizedError, UnprocessableEntityError, UnsupportedMediaTypeError, } from '@node-yalc/errors';
import { getLogLevelByError, getLogLevelByStatus } from './event.helper.js';
import { httpStatusCodeToErrors } from '@node-yalc/errors';
import { isClass } from '@node-yalc/utils';
import { err, ok } from 'neverthrow';
/**
 * Helper to inject a trace into the options object if it's not already set.
 */
export function injectTrace(options) {
    if (typeof options !== 'object' || options === null) {
        options = {};
    }
    if (options &&
        !options.stack &&
        !options.errorClass?.stack &&
        !options.cause?.stack) {
        options.stack = new Error().stack;
    }
    return options;
}
export class YalcEventService {
    constructor(loggerService, eventEmitter, options) {
        this.loggerService = loggerService;
        this.eventEmitter = eventEmitter;
        this.options = options;
        /**
         * Alias for log
         */
        this.emit = this.log;
        this.emitAsync = this.logAsync;
    }
    get logger() {
        return this.loggerService;
    }
    get emitter() {
        return this.eventEmitter;
    }
    /**
     * We do not expose it because the types might be too widely open and allow arbitrary properties, therefore mistakes
     */
    _error(eventName, options) {
        return eventError(eventName, this.buildOptions(options));
    }
    async logAsync(eventName, options) {
        return eventLogAsync(eventName, this.buildOptions(options));
    }
    async _errorAsync(eventName, options) {
        return eventErrorAsync(eventName, this.buildOptions(options));
    }
    error(eventName, options) {
        options = injectTrace(options);
        options = injectTrace(options);
        return this._error(eventName, this.buildErrorOptions(options));
    }
    /**
     * Use this method to return an Error variant of ResultAsync with a DefaultError.
     */
    errorResult(eventName, options) {
        return err(this.error(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a DefaultError.
     */
    async errorFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorResult(eventName, this.applyCause(error, options));
        }
    }
    async errorAsync(eventName, options) {
        options = injectTrace(options);
        options = injectTrace(options);
        return this._errorAsync(eventName, this.buildErrorOptions(options));
    }
    async warnAsync(eventName, options) {
        return eventWarnAsync(eventName, this.buildOptions(options));
    }
    async debugAsync(eventName, options) {
        return eventDebugAsync(eventName, this.buildOptions(options));
    }
    async verboseAsync(eventName, options) {
        return eventVerboseAsync(eventName, this.buildOptions(options));
    }
    log(eventName, options) {
        return eventLog(eventName, this.buildOptions(options));
    }
    warn(eventName, options) {
        return eventWarn(eventName, this.buildOptions(options));
    }
    debug(eventName, options) {
        return eventDebug(eventName, this.buildOptions(options));
    }
    verbose(eventName, options) {
        return eventVerbose(eventName, this.buildOptions(options));
    }
    /**
     * Use this method to throw an error with arbitrary status code. 500 by default.
     */
    errorHttp(eventName, errorCode, options) {
        const httpCode = errorCode;
        const selectedError = httpStatusCodeToErrors[httpCode] ?? InternalServerError;
        const mergedOptions = this.applyLoggerLevel(applyAwaitOption(this.buildErrorOptions(options, selectedError)), getLogLevelByStatus(errorCode));
        return this._error(eventName, mergedOptions);
    }
    errorHttpResult(eventName, errorCode, options) {
        const httpCode = errorCode;
        const selectedError = httpStatusCodeToErrors[httpCode] ?? InternalServerError;
        const mergedOptions = this.applyLoggerLevel(applyAwaitOption(this.buildErrorOptions(options, selectedError)), getLogLevelByStatus(errorCode));
        return err(this._error(eventName, mergedOptions));
    }
    /**
     * Use this method to proxy an error generated somewhere else. Very useful with try{} catch{} blocks.
     * Where you do not want to change the nature of the error, but you want to forward it instead.
     *
     * NOTE: data property is deep-merged with the error data, with precedence to the errorForward data.
     */
    errorForward(eventName, error, options) {
        const rebasedError = errorToDefaultError(error);
        let mergedOptions = this.buildErrorOptions(options, rebasedError);
        if (mergedOptions.logger === undefined) {
            mergedOptions = this.applyLoggerLevelByStatus(mergedOptions, rebasedError);
        }
        return this._error(eventName, {
            ...mergedOptions,
        });
    }
    /**
     * Use this method to forward an error and return an error variant of ResultAsync object.
     */
    errorForwardResult(eventName, error, options) {
        return err(this.errorForward(eventName, error, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error will be forwarded from the promise, with extra options added.
     * If the error is not a subtype of DefaultError, it will be converted to a DefaultError.
     */
    async errorForwardFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorForwardResult(eventName, error, options);
        }
    }
    /**
     * Use this method to throw a 400 Bad Request error when the request could not be understood or was missing required parameters.
     */
    errorBadRequest(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, BadRequestError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a BadRequestError representing a 400 Bad Request error.
     */
    errorBadRequestResult(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, BadRequestError)));
        return err(this._error(eventName, mergedOptions));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a BadRequestError representing a 400 Bad Request error.
     */
    async errorBadRequestFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorBadRequestResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 401 Unauthorized error when authentication is required and has failed or has not yet been provided.
     */
    errorUnauthorized(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, UnauthorizedError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with an UnauthorizedError representing a 401 Unauthorized error.
     */
    errorUnauthorizedResult(eventName, options) {
        return err(this.errorUnauthorized(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be an UnauthorizedError representing a 401 Unauthorized error.
     */
    async errorUnauthorizedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorUnauthorizedResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 402 Payment Required error. This status code is reserved for future use.
     */
    errorPaymentRequired(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, PaymentRequiredError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to throw a 403 Forbidden error when the client does not have access rights to the content.
     */
    errorForbidden(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, ForbiddenError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a ForbiddenError representing a 403 Forbidden error.
     */
    errorForbiddenResult(eventName, options) {
        return err(this.errorForbidden(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a ForbiddenError representing a 403 Forbidden error.
     */
    async errorForbiddenFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorForbiddenResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 404 Not Found error when the server can not find the requested resource.
     */
    errorNotFound(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, NotFoundError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a NotFoundError representing a 404 Not Found error.
     */
    errorNotFoundResult(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, NotFoundError)));
        return err(this._error(eventName, mergedOptions));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a NotFoundError representing a 404 Not Found error.
     */
    async errorNotFoundFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorNotFoundResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 405 Method Not Allowed error when the HTTP method is not supported for the requested resource.
     */
    errorMethodNotAllowed(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, MethodNotAllowedError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a MethodNotAllowedError representing a 405 Method Not Allowed error.
     */
    errorMethodNotAllowedResult(eventName, options) {
        return err(this.errorMethodNotAllowed(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a MethodNotAllowedError representing a 405 Method Not Allowed error.
     */
    async errorMethodNotAllowedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorMethodNotAllowedResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 406 Not Acceptable error when the server cannot produce a response matching the list of acceptable values defined in the request's headers.
     */
    errorNotAcceptable(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, NotAcceptableError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a NotAcceptableError representing a 406 Not Acceptable error.
     */
    errorNotAcceptableResult(eventName, options) {
        return err(this.errorNotAcceptable(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a NotAcceptableError representing a 406 Not Acceptable error.
     */
    async errorNotAcceptableFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorNotAcceptableResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 409 Conflict error when the request could not be completed due to a conflict with the current state of the target resource.
     */
    errorConflict(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, ConflictError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a ConflictError representing a 409 Conflict error.
     */
    errorConflictResult(eventName, options) {
        return err(this.errorConflict(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a ConflictError representing a 409 Conflict error.
     */
    async errorConflictFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorConflictResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 410 Gone error when the target resource is no longer available at the origin server and no forwarding address is known.
     */
    errorGone(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, GoneError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a GoneError representing a 410 Gone error.
     */
    errorGoneResult(eventName, options) {
        return err(this.errorGone(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a GoneError representing a 410 Gone error.
     */
    async errorGoneFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorGoneResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 415 Unsupported Media Type error when the request entity has a media type which the server or resource does not support.
     */
    errorUnsupportedMediaType(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, UnsupportedMediaTypeError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with an UnsupportedMediaTypeError representing a 415 Unsupported Media Type error.
     */
    errorUnsupportedMediaTypeResult(eventName, options) {
        return err(this.errorUnsupportedMediaType(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be an UnsupportedMediaTypeError representing a 415 Unsupported Media Type error.
     */
    async errorUnsupportedMediaTypeFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorUnsupportedMediaTypeResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 422 Unprocessable Entity error when the server understands the content type of the request entity, but was unable to process the contained instructions.
     */
    errorUnprocessableEntity(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, UnprocessableEntityError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with an UnprocessableEntityError representing a 422 Unprocessable Entity error.
     */
    errorUnprocessableEntityResult(eventName, options) {
        return err(this.errorUnprocessableEntity(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be an UnprocessableEntityError representing a 422 Unprocessable Entity error.
     */
    async errorUnprocessableEntityFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorUnprocessableEntityResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 429 Too Many Requests error when the user has sent too many requests in a given amount of time.
     */
    errorTooManyRequests(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, TooManyRequestsError)));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a TooManyRequestsError representing a 429 Too Many Requests error.
     */
    errorTooManyRequestsResult(eventName, options) {
        return err(this.errorTooManyRequests(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a TooManyRequestsError representing a 429 Too Many Requests error.
     */
    async errorTooManyRequestsFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorTooManyRequestsResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 500 Internal Server Error when the server encountered an unexpected condition that prevented it from fulfilling the request.
     */
    errorInternalServerError(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, InternalServerError));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with an InternalServerError representing a 500 Internal Server Error error.
     */
    errorInternalServerErrorResult(eventName, options) {
        return err(this.errorInternalServerError(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be an InternalServerError representing a 500 Internal Server Error error.
     */
    async errorInternalServerErrorFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorInternalServerErrorResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 501 Not Implemented error when the server does not support the functionality required to fulfill the request.
     */
    errorNotImplemented(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, NotImplementedError));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a NotImplementedError representing a 501 Not Implemented error.
     */
    errorNotImplementedResult(eventName, options) {
        return err(this.errorNotImplemented(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a NotImplementedError representing a 501 Not Implemented error.
     */
    async errorNotImplementedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorNotImplementedResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 502 Bad Gateway error when one server on the internet received an invalid response from another server.
     */
    errorBadGateway(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, BadGatewayError));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a BadGatewayError representing a 502 Bad Gateway error.
     */
    errorBadGatewayResult(eventName, options) {
        return err(this.errorBadGateway(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a BadGatewayError representing a 502 Bad Gateway error.
     */
    async errorBadGatewayFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorBadGatewayResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 503 Service Unavailable error when the server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded.
     */
    errorServiceUnavailable(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, ServiceUnavailableError));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a ServiceUnavailableError representing a 503 Service Unavailable error.
     */
    errorServiceUnavailableResult(eventName, options) {
        return err(this.errorServiceUnavailable(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a ServiceUnavailableError representing a 503 Service Unavailable error.
     */
    async errorServiceUnavailableFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorServiceUnavailableResult(eventName, options);
        }
    }
    /**
     * Use this method to throw a 504 Gateway Timeout error when one server did not receive a timely response from another server or some other auxiliary server it needed to access to complete the request.
     */
    errorGatewayTimeout(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, GatewayTimeoutError));
        return this._error(eventName, mergedOptions);
    }
    /**
     * Use this method to construct an Error variant of ResultAsync with a GatewayTimeoutError representing a 504 Gateway Timeout error.
     */
    errorGatewayTimeoutResult(eventName, options) {
        return err(this.errorGatewayTimeout(eventName, options));
    }
    /**
     * Use this method to wrap a promise in a ResultAsync object. The error variant will be a GatewayTimeoutError representing a 504 Gateway Timeout error.
     */
    async errorGatewayTimeoutFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorGatewayTimeoutResult(eventName, options);
        }
    }
    getLoggerLevelByOptions(options) {
        return getLogLevelByError(options.errorClass);
    }
    applyLoggerLevel(options, level) {
        if (options?.logger === false)
            return options;
        const loggerOption = resolveLoggerOption(options?.logger);
        return {
            ...options,
            logger: {
                ...(loggerOption || {}),
                level,
            },
        };
    }
    applyLoggerLevelByStatus(options, error) {
        const level = getLogLevelByStatus(error.getStatus());
        return this.applyLoggerLevel(options, level);
    }
    applyLoggerLevelByError(options) {
        const level = this.getLoggerLevelByOptions(options);
        return this.applyLoggerLevel(options, level);
    }
    /**
     * Use this method to apply a Error instance to an options object.
     */
    applyCause(cause, options) {
        return {
            ...options,
            cause,
        };
    }
    /**
     * Merges the methods options with the constructor options.
     */
    buildOptions(options) {
        const _options = { ...options };
        let event;
        if (_options?.event !== undefined || this.eventEmitter) {
            event =
                _options.event === false
                    ? false
                    : {
                        ..._options?.event,
                        emitter: _options?.event?.emitter ?? this.eventEmitter,
                        formatter: _options?.event?.formatter ?? this.options?.formatter,
                    };
        }
        if (isErrorOptions(_options)) {
            const _errorOptions = _options;
            /**
             * If the errorClass is not a class, it's an error instance. We need to extract the error information from it.
             */
            if (_errorOptions.errorClass &&
                _errorOptions.errorClass !== true &&
                !isClass(_errorOptions.errorClass)) {
                const error = errorToDefaultError(_errorOptions.errorClass);
                _errorOptions.stack ??= error.stack;
            }
            else if (_errorOptions.cause) {
                const cause = formatCause(_errorOptions.cause);
                _errorOptions.stack ??= cause?.stack;
            }
            else {
                /**
                 * If the errorClass is a class and no trace is set,
                 * we want to set the trace now to avoid extra stack traces down the line.
                 */
                _errorOptions.stack ??= new Error().stack;
            }
        }
        const loggerOption = resolveLoggerOption(_options?.logger);
        const res = {
            ..._options,
            event,
            logger: _options?.logger === false
                ? false
                : {
                    ...(loggerOption || {}),
                    instance: this.loggerService,
                },
        };
        return res;
    }
    buildErrorOptions(options = {}, defaultClass = true) {
        options.errorClass ??= defaultClass;
        return options;
    }
}
//# sourceMappingURL=event.service.js.map