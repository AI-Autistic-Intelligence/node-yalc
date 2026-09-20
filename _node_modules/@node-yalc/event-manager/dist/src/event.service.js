import { eventLogAsync, eventDebugAsync, eventErrorAsync, eventVerboseAsync, eventWarnAsync, eventDebug, eventError, eventLog, eventVerbose, eventWarn, applyAwaitOption, isErrorOptions, resolveLoggerOption, } from './event.js';
import { errorToDefaultError, formatCause, } from '@node-yalc/errors/default.error.js';
import { BadGatewayError, BadRequestError, ConflictError, ForbiddenError, GatewayTimeoutError, GoneError, InternalServerError, MethodNotAllowedError, NotAcceptableError, NotFoundError, NotImplementedError, PaymentRequiredError, ServiceUnavailableError, TooManyRequestsError, UnauthorizedError, UnprocessableEntityError, UnsupportedMediaTypeError, } from '@node-yalc/errors/error.class.js';
import { getLogLevelByError, getLogLevelByStatus } from './event.helper.js';
import { httpStatusCodeToErrors } from '@node-yalc/errors/http-status-code-to-errors.js';
import { isClass } from '@node-yalc/utils/class.helper.js';
import { err, ok } from 'neverthrow';
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
        this.emit = this.log;
        this.emitAsync = this.logAsync;
    }
    get logger() {
        return this.loggerService;
    }
    get emitter() {
        return this.eventEmitter;
    }
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
    errorResult(eventName, options) {
        return err(this.error(eventName, options));
    }
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
    errorForwardResult(eventName, error, options) {
        return err(this.errorForward(eventName, error, options));
    }
    async errorForwardFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorForwardResult(eventName, error, options);
        }
    }
    errorBadRequest(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, BadRequestError)));
        return this._error(eventName, mergedOptions);
    }
    errorBadRequestResult(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, BadRequestError)));
        return err(this._error(eventName, mergedOptions));
    }
    async errorBadRequestFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorBadRequestResult(eventName, options);
        }
    }
    errorUnauthorized(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, UnauthorizedError)));
        return this._error(eventName, mergedOptions);
    }
    errorUnauthorizedResult(eventName, options) {
        return err(this.errorUnauthorized(eventName, options));
    }
    async errorUnauthorizedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorUnauthorizedResult(eventName, options);
        }
    }
    errorPaymentRequired(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, PaymentRequiredError)));
        return this._error(eventName, mergedOptions);
    }
    errorForbidden(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, ForbiddenError)));
        return this._error(eventName, mergedOptions);
    }
    errorForbiddenResult(eventName, options) {
        return err(this.errorForbidden(eventName, options));
    }
    async errorForbiddenFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorForbiddenResult(eventName, options);
        }
    }
    errorNotFound(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, NotFoundError)));
        return this._error(eventName, mergedOptions);
    }
    errorNotFoundResult(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, NotFoundError)));
        return err(this._error(eventName, mergedOptions));
    }
    async errorNotFoundFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorNotFoundResult(eventName, options);
        }
    }
    errorMethodNotAllowed(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, MethodNotAllowedError)));
        return this._error(eventName, mergedOptions);
    }
    errorMethodNotAllowedResult(eventName, options) {
        return err(this.errorMethodNotAllowed(eventName, options));
    }
    async errorMethodNotAllowedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorMethodNotAllowedResult(eventName, options);
        }
    }
    errorNotAcceptable(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, NotAcceptableError)));
        return this._error(eventName, mergedOptions);
    }
    errorNotAcceptableResult(eventName, options) {
        return err(this.errorNotAcceptable(eventName, options));
    }
    async errorNotAcceptableFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorNotAcceptableResult(eventName, options);
        }
    }
    errorConflict(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, ConflictError)));
        return this._error(eventName, mergedOptions);
    }
    errorConflictResult(eventName, options) {
        return err(this.errorConflict(eventName, options));
    }
    async errorConflictFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorConflictResult(eventName, options);
        }
    }
    errorGone(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, GoneError)));
        return this._error(eventName, mergedOptions);
    }
    errorGoneResult(eventName, options) {
        return err(this.errorGone(eventName, options));
    }
    async errorGoneFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorGoneResult(eventName, options);
        }
    }
    errorUnsupportedMediaType(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, UnsupportedMediaTypeError)));
        return this._error(eventName, mergedOptions);
    }
    errorUnsupportedMediaTypeResult(eventName, options) {
        return err(this.errorUnsupportedMediaType(eventName, options));
    }
    async errorUnsupportedMediaTypeFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorUnsupportedMediaTypeResult(eventName, options);
        }
    }
    errorUnprocessableEntity(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, UnprocessableEntityError)));
        return this._error(eventName, mergedOptions);
    }
    errorUnprocessableEntityResult(eventName, options) {
        return err(this.errorUnprocessableEntity(eventName, options));
    }
    async errorUnprocessableEntityFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorUnprocessableEntityResult(eventName, options);
        }
    }
    errorTooManyRequests(eventName, options) {
        const mergedOptions = this.applyLoggerLevelByError(applyAwaitOption(this.buildErrorOptions(options, TooManyRequestsError)));
        return this._error(eventName, mergedOptions);
    }
    errorTooManyRequestsResult(eventName, options) {
        return err(this.errorTooManyRequests(eventName, options));
    }
    async errorTooManyRequestsFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorTooManyRequestsResult(eventName, options);
        }
    }
    errorInternalServerError(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, InternalServerError));
        return this._error(eventName, mergedOptions);
    }
    errorInternalServerErrorResult(eventName, options) {
        return err(this.errorInternalServerError(eventName, options));
    }
    async errorInternalServerErrorFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorInternalServerErrorResult(eventName, options);
        }
    }
    errorNotImplemented(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, NotImplementedError));
        return this._error(eventName, mergedOptions);
    }
    errorNotImplementedResult(eventName, options) {
        return err(this.errorNotImplemented(eventName, options));
    }
    async errorNotImplementedFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorNotImplementedResult(eventName, options);
        }
    }
    errorBadGateway(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, BadGatewayError));
        return this._error(eventName, mergedOptions);
    }
    errorBadGatewayResult(eventName, options) {
        return err(this.errorBadGateway(eventName, options));
    }
    async errorBadGatewayFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorBadGatewayResult(eventName, options);
        }
    }
    errorServiceUnavailable(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, ServiceUnavailableError));
        return this._error(eventName, mergedOptions);
    }
    errorServiceUnavailableResult(eventName, options) {
        return err(this.errorServiceUnavailable(eventName, options));
    }
    async errorServiceUnavailableFromFn(eventName, cb, options) {
        try {
            const result = await cb();
            return ok(result);
        }
        catch (error) {
            return this.errorServiceUnavailableResult(eventName, options);
        }
    }
    errorGatewayTimeout(eventName, options) {
        const mergedOptions = applyAwaitOption(this.buildErrorOptions(options, GatewayTimeoutError));
        return this._error(eventName, mergedOptions);
    }
    errorGatewayTimeoutResult(eventName, options) {
        return err(this.errorGatewayTimeout(eventName, options));
    }
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
    applyCause(cause, options) {
        return {
            ...options,
            cause,
        };
    }
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