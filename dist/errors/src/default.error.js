"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorToDefaultError = exports.DefaultError = exports.DefaultErrorMixin = exports.newDefaultError = exports.ON_DEFAULT_ERROR_EVENT = void 0;
exports.formatCause = formatCause;
exports.DefaultErrorBase = DefaultErrorBase;
exports.isDefaultErrorMixin = isDefaultErrorMixin;
exports.isDefaultErrorMixinClass = isDefaultErrorMixinClass;
const global_emitter_js_1 = require("../../event-manager/src/global-emitter.js");
const logger_factory_js_1 = require("../../logger/src/logger.factory.js");
const logger_helper_js_1 = require("../../logger/src/logger.helper.js");
const http_helper_js_1 = require("../../utils/src/http.helper.js");
const http_exception_js_1 = require("./http.exception.js");
const http_status_enum_js_1 = require("./http-status.enum.js");
const error_enum_js_1 = require("./error.enum.js");
const object_helper_js_1 = require("../../utils/src/object.helper.js");
const class_helper_js_1 = require("../../utils/src/class.helper.js");
exports.ON_DEFAULT_ERROR_EVENT = 'onDefaultError';
const newDefaultError = (base, options, ...args) => {
    return new ((0, exports.DefaultErrorMixin)(base))(options, ...args);
};
exports.newDefaultError = newDefaultError;
function formatCause(error) {
    if (!error) {
        return undefined;
    }
    return {
        ...error,
        message: error.message ?? error.toString(),
        stack: error.stack,
        parentCause: error.cause ? formatCause(error.cause) : undefined,
        cause: undefined,
    };
}
const DefaultErrorMixin = (base) => {
    const BaseClass = base ?? http_exception_js_1.HttpException;
    class _AbstractDefaultError extends BaseClass {
        static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR; }
        constructor(options, ...args) {
            super(...args);
            this.__DefaultErrorMixin = Object.freeze(true);
            const message = options.internalMessage ?? this.message;
            this.setErrorInfo(options);
            if (options.logger) {
                const { instance, level } = options.logger !== true
                    ? options.logger
                    : { instance: undefined, level: undefined };
                let defaultLevel = 'log';
                const statusCode = this.getStatus();
                if (statusCode >= http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR) {
                    defaultLevel = 'error';
                }
                else if (statusCode === http_status_enum_js_1.HttpStatus.TOO_MANY_REQUESTS) {
                    defaultLevel = 'warn';
                }
                else if (statusCode >= http_status_enum_js_1.HttpStatus.BAD_REQUEST) {
                    defaultLevel = 'log';
                }
                this.logger = {
                    instance: instance ?? (0, logger_factory_js_1.AppLoggerFactory)('DefaultError'),
                    level: level ?? defaultLevel,
                };
                if (this.logger.level === 'error') {
                    this.logger.instance.error(message, this.resolvedStack, {
                        data: this.eventPayload,
                        stack: this.resolvedStack,
                    });
                }
                else {
                    this.logger.instance?.[this.logger.level]?.(message, {
                        data: this.eventPayload,
                        stack: this.resolvedStack,
                    });
                }
            }
            const eventEmitter = options.eventEmitter === true || options.eventEmitter === undefined
                ? (0, global_emitter_js_1.getYalcGlobalEventEmitter)()
                : options.eventEmitter;
            if (eventEmitter !== false) {
                this.eventName ??= exports.ON_DEFAULT_ERROR_EVENT;
                this.eventEmitter = eventEmitter;
                this.eventEmitter.emit(this.eventName, {
                    ...this.eventPayload,
                    eventName: this.eventName,
                });
            }
        }
        setErrorInfo(options) {
            const stack = options.stack ?? this.stack;
            const errorCode = this.getStatus();
            this.cause = formatCause(this.cause);
            this.internalMessage = options.internalMessage ?? this.cause?.message;
            this.eventName = options.eventName;
            this.description =
                options.description ?? (0, http_helper_js_1.getHttpStatusDescription)(errorCode);
            this.betterResponse = _AbstractDefaultError.buildResponse(this.message, this.description, errorCode, options?.response ?? super.getResponse());
            this.data = options.masks
                ? (0, logger_helper_js_1.maskDataInObject)(options.data, options.masks)
                : options.data;
            const cause = this.cause;
            const payload = {
                data: this.data,
                eventName: this.eventName,
                description: this.description,
                internalMessage: this.internalMessage,
                errorName: this.name,
                ...this.betterResponse,
                stack,
                cause,
            };
            this.resolvedStack = stack;
            this.eventPayload = payload;
        }
        mergeErrorInfo(info) {
            const { internalMessage, description, eventName, data, stack, cause, response, ...rest } = info;
            if (internalMessage)
                this.internalMessage = internalMessage;
            if (description)
                this.description = description;
            if (eventName)
                this.eventName = eventName;
            if (data)
                this.data = (0, object_helper_js_1.deepMergeWithoutArrayConcat)(this.data ?? {}, data);
            if (stack)
                this.resolvedStack = stack;
            if (cause) {
                this.cause = formatCause(cause);
                this.eventPayload.cause = this.cause;
            }
            if (response) {
                this.betterResponse = {
                    ...this.betterResponse,
                    ..._AbstractDefaultError.buildResponse(this.message, this.description, this.getStatus(), response),
                };
                this.message = this.betterResponse.message;
            }
            this.eventPayload = {
                ...this.eventPayload,
                ...rest,
                data: this.data,
                eventName: this.eventName,
                description: this.description,
                internalMessage: this.internalMessage,
                errorName: this.name,
                ...this.betterResponse,
                stack: this.resolvedStack,
            };
        }
        getEventPayload() {
            return this.eventPayload;
        }
        getInternalMessage() {
            return this.internalMessage;
        }
        getDescription() {
            return this.description;
        }
        getResponse() {
            return this.betterResponse;
        }
        toString() {
            return `${this.internalMessage ?? this.message} -\n [INFO: ${JSON.stringify(this.eventPayload, null, 2)}]`;
        }
        static buildResponse(message, codeDescription, statusCode, response) {
            let responseObj = {};
            if (typeof response === 'string' || response instanceof String) {
                message = response;
            }
            else {
                responseObj = response;
            }
            const baseBody = http_exception_js_1.HttpException.createBody(message, (0, error_enum_js_1.getHttpStatusNameByCode)(statusCode), statusCode);
            return {
                statusCodeDescription: codeDescription,
                ...baseBody,
                message,
                ...responseObj,
            };
        }
    }
    return _AbstractDefaultError;
};
exports.DefaultErrorMixin = DefaultErrorMixin;
function DefaultErrorBase(base) {
    return class extends (0, exports.DefaultErrorMixin)(base ?? http_exception_js_1.HttpException) {
        static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR; }
        constructor(internalMessage, options, ...args) {
            super({ ...(options ?? {}), internalMessage }, ...args);
        }
    };
}
class DefaultError extends DefaultErrorBase(http_exception_js_1.HttpException) {
    static { this.defaultStatusCode = http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR; }
    constructor(internalMessage, options) {
        const { description, cause, response, errorCode, ...defaultOptions } = options ?? {};
        super(internalMessage, { ...defaultOptions, description }, response ?? {}, errorCode ?? http_status_enum_js_1.HttpStatus.INTERNAL_SERVER_ERROR, {
            description,
            cause,
        });
    }
}
exports.DefaultError = DefaultError;
const errorToDefaultError = (error, options = {}) => {
    try {
        if (isDefaultErrorMixin(error)) {
            return error;
        }
    }
    catch (e) { }
    try {
        if (error instanceof http_exception_js_1.HttpException) {
            JSON.stringify(error.cause);
            return new DefaultError(error.message, {
                errorCode: error.getStatus(),
                response: {
                    message: error.getResponse().toString(),
                    error: error.name,
                    statusCode: error.getStatus(),
                    statusCodeDescription: (0, http_helper_js_1.getHttpStatusDescription)(error.getStatus()),
                },
                stack: error.stack,
                cause: error.cause,
                ...options,
            });
        }
    }
    catch (e) { }
    let name;
    try {
        name = error.name ?? 'UnknownError';
        if (typeof name !== 'string') {
            name = 'UnknownError';
        }
    }
    catch (e) {
        name = 'UnknownError';
    }
    let message;
    try {
        message = error.message ?? 'UnknownError';
        if (typeof message !== 'string') {
            message = 'UnknownError';
        }
    }
    catch (e) {
        message = 'UnknownError';
    }
    let stack;
    try {
        JSON.stringify(error.stack);
        stack = error.stack;
    }
    catch (e) { }
    let cause;
    try {
        const errorCause = error.cause;
        JSON.stringify(errorCause);
        cause = errorCause;
    }
    catch (e) { }
    return new DefaultError(message, {
        stack,
        cause,
        response: {
            error: name,
        },
        ...options,
    });
};
exports.errorToDefaultError = errorToDefaultError;
function isDefaultErrorMixin(error) {
    return error.__DefaultErrorMixin !== undefined;
}
function isDefaultErrorMixinClass(error) {
    return ((0, class_helper_js_1.isClass)(error) &&
        error.defaultStatusCode !== undefined);
}
//# sourceMappingURL=default.error.js.map