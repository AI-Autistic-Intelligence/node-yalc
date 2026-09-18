"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var default_error_js_1 = require("../default.error.js");
var eventemitter2_1 = require("eventemitter2");
var events_1 = require("events");
var error_class_js_1 = require("../error.class.js");
var http_helper_js_1 = require("@node-yalc/utils/http.helper.js");
(0, globals_1.describe)('DefaultErrorMixin', function () {
    (0, globals_1.it)('should create a class that extends Error when no base class is provided', function () {
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({}, 'message', 500);
        (0, globals_1.expect)(error).toBeInstanceOf(Error);
        (0, globals_1.expect)(error.message).toBe('message');
    });
    (0, globals_1.it)('should create a class that extends the provided base class', function () {
        var CustomError = /** @class */ (function (_super) {
            __extends(CustomError, _super);
            function CustomError() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CustomError;
        }(error_class_js_1.HttpException));
        var error = new ((0, default_error_js_1.DefaultErrorMixin)(CustomError))({}, 'message', 500);
        (0, globals_1.expect)(error).toBeInstanceOf(CustomError);
        (0, globals_1.expect)(error.message).toBe('message');
    });
    (0, globals_1.it)('should set internalMessage when options is a string', function () {
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ internalMessage: 'internalMessage' }, {}, 500);
        (0, globals_1.expect)(error.internalMessage).toBe('internalMessage');
    });
    (0, globals_1.it)('should set data when data option is provided', function () {
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ data: 'data' }, 'message', 500);
        (0, globals_1.expect)(error.data).toBe('data'); // Note: You might want to mock `maskDataInObject` to test this
    });
    (0, globals_1.it)('should set data when masked data option is provided', function () {
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ data: { test: 'test' }, masks: ['test'] }, 'message', 500);
        (0, globals_1.expect)(error.data).toEqual({ test: '[REDACTED]' });
    });
    (0, globals_1.it)('should set internalMessage when internalMessage option is provided', function () {
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({
            internalMessage: 'internalMessage',
        }, 'message', 500);
        (0, globals_1.expect)(error.internalMessage).toBe('internalMessage');
    });
    (0, globals_1.it)('should log error when logger option is provided', function () {
        var logger = { error: globals_1.jest.fn() };
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ logger: { instance: logger, level: 'error' } }, 'message', 500);
        (0, globals_1.expect)(logger.error).toHaveBeenCalled();
    });
    (0, globals_1.it)('should use console as logger when logger option is true', function () {
        var logger = { error: globals_1.jest.fn() };
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ logger: {} }, 'message', 500);
        // expect(logger.error).toHaveBeenCalled();
    });
    (0, globals_1.it)('should emit an event when eventEmitter option is provided', function () {
        var eventEmitter = new events_1.default();
        var eventHandler = globals_1.jest.fn();
        eventEmitter.on(default_error_js_1.ON_DEFAULT_ERROR_EVENT, eventHandler);
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ eventEmitter: eventEmitter }, 'message');
        (0, globals_1.expect)(eventHandler).toHaveBeenCalled();
    });
    (0, globals_1.it)('should emit an event when eventEmitter2 option is provided', function () {
        var eventEmitter = new eventemitter2_1.EventEmitter2();
        var eventHandler = globals_1.jest.fn();
        eventEmitter.on(default_error_js_1.ON_DEFAULT_ERROR_EVENT, eventHandler);
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ eventEmitter: eventEmitter }, 'message', 500);
        (0, globals_1.expect)(eventHandler).toHaveBeenCalled();
    });
    (0, globals_1.it)('should not emit an event when eventEmitter option is false', function () {
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ eventEmitter: false }, 'message', 500);
        (0, globals_1.expect)(error.eventEmitter).toBeUndefined();
    });
});
(0, globals_1.describe)('newDefaultError', function () {
    (0, globals_1.it)('should create a new DefaultError class instance that extends the provided base class', function () {
        var CustomError = /** @class */ (function (_super) {
            __extends(CustomError, _super);
            function CustomError() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return CustomError;
        }(error_class_js_1.HttpException));
        var error = (0, default_error_js_1.newDefaultError)(CustomError, {}, 'message', 500);
        (0, globals_1.expect)(error).toBeInstanceOf(CustomError);
        (0, globals_1.expect)(error.message).toBe('message');
    });
});
(0, globals_1.describe)('DefaultError', function () {
    (0, globals_1.it)('should create an instance of Error', function () {
        var error = new default_error_js_1.DefaultError('my internal message', {
            response: 'my external message',
            logger: true,
        });
        (0, globals_1.expect)(error).toBeInstanceOf(Error);
        (0, globals_1.expect)(error.message).toBe('my external message');
        (0, globals_1.expect)(error.internalMessage).toBe('my internal message');
    });
    (0, globals_1.it)('should be able to use the setErrorInfo method', function () {
        var error = new default_error_js_1.DefaultError('my internal message', {
            logger: true,
        });
        error.setErrorInfo({ data: 'test error info' });
        (0, globals_1.expect)(error.getEventPayload()).toMatchObject({ data: 'test error info' });
    });
    (0, globals_1.it)('should be able to use the mergeErrorInfo method', function () {
        var error = new default_error_js_1.DefaultError('my internal message', {
            logger: true,
        });
        error.mergeErrorInfo({
            data: { test: 'test error info' },
            response: { message: 'test error response' },
            cause: new Error('test cause'),
            internalMessage: 'test internal message',
            description: 'test description',
            eventName: 'test event name',
            stack: 'test stack',
        });
        (0, globals_1.expect)(error.getEventPayload()).toMatchObject({
            data: { test: 'test error info' },
            message: 'test error response',
            cause: globals_1.expect.anything(),
            internalMessage: 'test internal message',
            description: 'test description',
            eventName: 'test event name',
            stack: 'test stack',
        });
    });
    (0, globals_1.it)('should be able to cover the mergeErrorInfo method', function () {
        var error = new default_error_js_1.DefaultError('my internal message', {
            logger: true,
            description: undefined,
            response: undefined,
        });
        error.mergeErrorInfo({
            data: { test: 'test error info' },
        });
        (0, globals_1.expect)(error.getEventPayload()).toMatchObject({
            data: { test: 'test error info' },
            message: 'Default Error',
        });
    });
    (0, globals_1.it)('should merge error info without replacing data when no data is provided', function () {
        var error = new default_error_js_1.DefaultError('my internal message', {
            data: { existing: true },
        });
        error.mergeErrorInfo({
            response: { message: 'updated response' },
        });
        (0, globals_1.expect)(error.getEventPayload()).toMatchObject({
            data: { existing: true },
            message: 'updated response',
        });
    });
    (0, globals_1.it)('should create an instance of Error with default message when message is not provided', function () {
        var error = new default_error_js_1.DefaultError();
        (0, globals_1.expect)(error).toBeInstanceOf(Error);
        (0, globals_1.expect)(error.message).toBe('Default Error'); // if not specified, the message will be the parsed name of the class
        (0, globals_1.expect)(error.internalMessage).toBeUndefined();
        (0, globals_1.expect)("".concat(error).startsWith("Default Error -")).toBeTruthy();
    });
    (0, globals_1.it)('should create an instance of Error with default options when options are not provided', function () {
        var error = new default_error_js_1.DefaultError('message');
        (0, globals_1.expect)(error).toBeInstanceOf(Error);
        (0, globals_1.expect)(error.message).toBe('Default Error');
        (0, globals_1.expect)(error.internalMessage).toBe('message');
        (0, globals_1.expect)(error.data).toBeUndefined();
    });
    (0, globals_1.it)('should create a DefaultErrorBase without base class', function () {
        var error = new ((0, default_error_js_1.DefaultErrorBase)())();
        (0, globals_1.expect)(error.message).toBe('Error');
    });
    (0, globals_1.it)('should create an instance of Error with response as a string', function () {
        var error = new default_error_js_1.DefaultError('message', {
            response: 'my response',
            logger: {
                level: 'log',
            },
        });
        (0, globals_1.expect)(error).toBeInstanceOf(Error);
        (0, globals_1.expect)(error.getResponse().message).toBe('my response');
        (0, globals_1.expect)(error.getInternalMessage()).toBe('message');
        (0, globals_1.expect)(error.getDescription()).toBe((0, http_helper_js_1.getHttpStatusDescription)(500));
        (0, globals_1.expect)(error.getEventPayload()).toEqual(globals_1.expect.anything());
    });
    (0, globals_1.it)('should create an instance of Error with response as an object', function () {
        var error = new default_error_js_1.DefaultError('message', {
            response: { message: 'ok', test: 'test' },
        });
        (0, globals_1.expect)(error).toBeInstanceOf(Error);
        (0, globals_1.expect)(error.getResponse().message).toBe('ok');
        (0, globals_1.expect)(error.getResponse().test).toBe('test');
    });
    (0, globals_1.it)('should create an instance of Error without options', function () {
        var error = new default_error_js_1.DefaultError();
        (0, globals_1.expect)(error).toBeInstanceOf(error_class_js_1.HttpException);
        (0, globals_1.expect)(error.getResponse().message).toBe('Default Error');
    });
    (0, globals_1.it)('should create an instance of Error without defaultError options', function () {
        var error = new default_error_js_1.DefaultError('internal test message', {
            description: 'this description should go in the info',
            data: { test: 'this property should go in the info' },
        });
        (0, globals_1.expect)(error).toBeInstanceOf(error_class_js_1.HttpException);
        (0, globals_1.expect)(error.getResponse().message).toBe('Default Error');
        (0, globals_1.expect)("".concat(error).startsWith('internal test message -')).toBeTruthy();
        (0, globals_1.expect)("".concat(error).includes('this description should go in the info')).toBeTruthy();
        (0, globals_1.expect)("".concat(error).includes('this property should go in the info')).toBeTruthy();
    });
    (0, globals_1.it)('should create an instance of the Error with options as a string', function () {
        var error = new ((0, default_error_js_1.DefaultErrorMixin)())({ internalMessage: 'internal' }, 'external');
        (0, globals_1.expect)(error.getResponse().message).toBe('external');
    });
    (0, globals_1.describe)('isDefaultErrorMixin', function () {
        (0, globals_1.it)('should check if an error is not of DefaultMixin type', function () {
            var check = (0, default_error_js_1.isDefaultErrorMixin)({});
            (0, globals_1.expect)(check).toBeFalsy();
        });
        (0, globals_1.it)('should check if an error is of DefaultMixin type', function () {
            var error = new default_error_js_1.DefaultError();
            var check = (0, default_error_js_1.isDefaultErrorMixin)(error);
            (0, globals_1.expect)(check).toBeTruthy();
        });
    });
    (0, globals_1.describe)('isDefaultErrorMixinClass', function () {
        (0, globals_1.it)('should check if an error is not of DefaultMixin type', function () {
            var check = (0, default_error_js_1.isDefaultErrorMixinClass)(error_class_js_1.BadRequestException);
            (0, globals_1.expect)(check).toBeFalsy();
        });
        (0, globals_1.it)('should check if an error is of DefaultMixin type', function () {
            var check = (0, default_error_js_1.isDefaultErrorMixinClass)(default_error_js_1.DefaultError);
            (0, globals_1.expect)(check).toBeTruthy();
        });
    });
    (0, globals_1.describe)('error cause', function () {
        (0, globals_1.it)('should return if no cause defined', function () {
            var check = new default_error_js_1.DefaultError('test', { cause: undefined });
            (0, globals_1.expect)(check.cause).toBeUndefined();
        });
        (0, globals_1.it)('should return if cause is defined', function () {
            var _a;
            var check = new default_error_js_1.DefaultError('test', { cause: new Error('test') });
            (0, globals_1.expect)(check.getEventPayload().cause).toBeDefined();
            (0, globals_1.expect)((_a = check.getEventPayload().cause) === null || _a === void 0 ? void 0 : _a.parentCause).toBeUndefined();
        });
        (0, globals_1.it)('should have multiple causes', function () {
            var _a;
            var check = new default_error_js_1.DefaultError('test', {
                cause: new default_error_js_1.DefaultError('test', { cause: { nonErrorCause: '' } }),
            });
            (0, globals_1.expect)(check.cause).toBeDefined();
            (0, globals_1.expect)((_a = check.getEventPayload().cause) === null || _a === void 0 ? void 0 : _a.parentCause).toBeDefined();
        });
    });
    (0, globals_1.describe)('errorToDefaultError', function () {
        globals_1.it.each([
            { name: 'standard Error', value: new Error('test') },
            { name: 'HttpException', value: new error_class_js_1.HttpException('test', 500) },
            { name: 'DefaultError', value: new default_error_js_1.DefaultError('test') },
            { name: 'string', value: 'test' },
            {
                name: 'object with message',
                value: { message: 'test' },
            },
            { name: 'empty object', value: {} },
            { name: 'null', value: null },
            { name: 'undefined', value: undefined },
            { name: 'number', value: 123 },
            { name: 'boolean', value: true },
            { name: 'array', value: [] },
            {
                name: 'nested error',
                value: { error: new Error('nested') },
            },
            {
                name: 'error with circular reference',
                value: (function () {
                    var err = new Error('circular');
                    err.self = err;
                    return err;
                })(),
            },
            {
                name: 'error with custom properties',
                value: Object.assign(new Error('custom'), { custom: 'property' }),
            },
            {
                name: 'BadRequestException',
                value: new error_class_js_1.BadRequestException('bad request'),
            },
            {
                name: 'ForbiddenException',
                value: new error_class_js_1.ForbiddenException('forbidden'),
            },
            {
                name: 'undefined with no prototype',
                value: Object.create(null),
            },
            {
                name: 'object with null prototype that mimics Error',
                value: Object.assign(Object.create(null), {
                    message: 'test',
                    name: 'FakeError',
                    stack: 'fake stack',
                }),
            },
            // These test method invocation problems with HttpException-like objects
            {
                name: 'fake HttpException with broken getStatus',
                value: Object.assign(new Error('test'), {
                    getStatus: function () {
                        throw new Error('getStatus exploded');
                    },
                    getResponse: function () { return ({ toString: function () { return 'response'; } }); },
                }),
            },
            {
                name: 'fake HttpException with broken getResponse',
                value: Object.assign(new Error('test'), {
                    getStatus: function () { return 500; },
                    getResponse: function () {
                        throw new Error('getResponse exploded');
                    },
                }),
            },
            {
                name: 'deeply nested circular reference',
                value: (function () {
                    var err = new Error('deep circular');
                    var nested = { parent: err, child: {} };
                    err.nested = nested;
                    // @ts-expect-error - this is a test
                    nested.child.backRef = nested;
                    return err;
                })(),
            },
            {
                name: 'HttpException with complex response object',
                value: new error_class_js_1.HttpException({
                    nested: {
                        deep: {
                            message: 'buried message',
                        },
                    },
                    circular: {},
                }, 500, { cause: new Error('cause') }),
            },
            {
                name: 'HttpException with array response',
                value: new error_class_js_1.HttpException(['error1', 'error2'], 400),
            },
            {
                name: 'custom error extending Error with broken inheritance',
                value: (function () {
                    function CustomError(message) {
                        this.message = message;
                        // Not calling Error constructor properly
                    }
                    CustomError.prototype = Object.create(Error.prototype);
                    return new CustomError('broken inheritance');
                })(),
            },
            {
                name: 'error with non-enumerable properties',
                value: (function () {
                    var err = new Error('hidden props');
                    Object.defineProperty(err, 'hiddenCause', {
                        value: new Error('hidden cause'),
                        enumerable: false,
                    });
                    return err;
                })(),
            },
            {
                name: 'frozen error object',
                value: Object.freeze(new Error('frozen')),
            },
            {
                name: 'proxy with revoked handler',
                value: (function () {
                    var _a = Proxy.revocable(new Error('revoked proxy'), {}), proxy = _a.proxy, revoke = _a.revoke;
                    revoke();
                    return proxy;
                })(),
            },
            {
                name: 'circular reference in cause',
                value: (function () {
                    var err = new Error('circular cause');
                    err.cause = new Error('cause error');
                    err.cause.parentError = err;
                    return err;
                })(),
            },
            {
                name: 'fake HttpException with getResponse returning bad value',
                value: Object.assign(new Error('test'), {
                    getStatus: function () { return 500; },
                    getResponse: function () { return ({
                        toString: function () {
                            throw new Error('toString exploded');
                        },
                    }); },
                }),
            },
            {
                name: 'Error with getter that throws on message',
                value: Object.defineProperty(new Error(), 'message', {
                    get: function () {
                        throw new Error('message getter exploded');
                    },
                }),
            },
            {
                name: 'Error with getter that throws on stack',
                value: Object.defineProperty(new Error('test'), 'stack', {
                    get: function () {
                        throw new Error('stack getter exploded');
                    },
                }),
            },
            {
                name: 'Error with non string name',
                value: { name: 123 },
            },
            {
                name: 'Error with non string message',
                value: { message: 123 },
            },
            {
                name: 'Error with string cause',
                value: { cause: 'test' },
            },
            {
                name: 'Error with array cause',
                value: { cause: ['test'] },
            },
            {
                name: 'Error with error throwing cause key',
                value: {
                    cause: Object.defineProperty({ test: 'test', boom: 'boom' }, 'boom', {
                        get: function () {
                            throw new Error('cause getter exploded');
                        },
                    }),
                },
            },
            {
                name: 'Error with getter that throws on name',
                value: Object.defineProperty(new Error('test'), 'name', {
                    get: function () {
                        throw new Error('name getter exploded');
                    },
                }),
            },
        ])('should safely convert $name to a DefaultError', function (_a) {
            var value = _a.value;
            var defaultError = (0, default_error_js_1.errorToDefaultError)(value);
            (0, globals_1.expect)(defaultError).toBeInstanceOf(default_error_js_1.DefaultError);
            (0, globals_1.expect)(function () { return JSON.stringify(defaultError); }).not.toThrow();
            (0, globals_1.expect)(defaultError.name).toBeDefined();
            (0, globals_1.expect)(defaultError.message).toBeDefined();
        });
    });
});
