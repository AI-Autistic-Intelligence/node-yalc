"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var error_helper_js_1 = require("../error.helper.js");
var error_class_js_1 = require("../error.class.js");
var error_class_js_2 = require("../error.class.js");
(0, globals_1.describe)('ErrorHelper', function () {
    (0, globals_1.it)('should return the correct status code', function () {
        (0, globals_1.expect)((0, error_helper_js_1.getStatusCodeFromError)(error_class_js_2.BadRequestError)).toBe(error_class_js_1.HttpStatus.BAD_REQUEST);
        (0, globals_1.expect)((0, error_helper_js_1.getStatusCodeFromError)(new error_class_js_2.BadRequestError())).toBe(error_class_js_1.HttpStatus.BAD_REQUEST);
        (0, globals_1.expect)((0, error_helper_js_1.getStatusCodeFromError)(new Error())).toBe(null);
        (0, globals_1.expect)((0, error_helper_js_1.getStatusCodeFromError)(Error)).toBe(null);
        (0, globals_1.expect)((0, error_helper_js_1.getStatusCodeFromError)(error_class_js_1.BadRequestException)).toBe(error_class_js_1.HttpStatus.BAD_REQUEST);
    });
});
