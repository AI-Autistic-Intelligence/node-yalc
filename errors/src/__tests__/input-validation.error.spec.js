"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var error_class_js_1 = require("../error.class.js");
var error_enum_js_1 = require("../error.enum.js");
(0, globals_1.describe)('InputValidationError', function () {
    (0, globals_1.it)('should have internal message without the custom message', function () {
        var customError = new error_class_js_1.InputValidationError();
        (0, globals_1.expect)(customError.internalMessage).toEqual('Invalid value');
    });
    (0, globals_1.it)('should set the custom message', function () {
        var customMessage = 'INVALID_INPUT_MESSAGE';
        var customError = new error_class_js_1.BadRequestError(customMessage);
        (0, globals_1.expect)(customError.internalMessage).toEqual("".concat(error_enum_js_1.ErrorsEnum.BAD_REQUEST, ": ").concat(customMessage));
    });
});
