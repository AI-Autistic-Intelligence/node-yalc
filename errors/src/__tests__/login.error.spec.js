"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var error_enum_js_1 = require("../error.enum.js");
var index_js_1 = require("../index.js");
(0, globals_1.describe)('Login error', function () {
    var error = new index_js_1.LoginError();
    (0, globals_1.it)('should be defined', function () {
        (0, globals_1.expect)(error).toBeDefined();
    });
    (0, globals_1.it)('should have the correct message', function () {
        (0, globals_1.expect)(error.getInternalMessage()).toEqual(error_enum_js_1.ErrorsEnum.BAD_LOGIN);
    });
    (0, globals_1.it)('should set the custom message', function () {
        var customMessage = 'Something catastrophic happened!';
        var customError = new index_js_1.LoginError(customMessage);
        (0, globals_1.expect)(customError.getInternalMessage()).toEqual("".concat(error_enum_js_1.ErrorsEnum.BAD_LOGIN, ": ").concat(customMessage));
    });
});
