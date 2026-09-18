"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_code_to_errors_js_1 = require("../http-status-code-to-errors.js");
var error_class_js_1 = require("../error.class.js");
var globals_1 = require("@jest/globals");
(0, globals_1.describe)('should test ', function () {
    (0, globals_1.it)('should return not found error when given code 404', function () {
        var httpCode = 404;
        var result = http_status_code_to_errors_js_1.httpStatusCodeToErrors[httpCode];
        (0, globals_1.expect)(result).toBe(error_class_js_1.NotFoundError);
    });
    (0, globals_1.it)('should return bad request error when given code 400', function () {
        var httpCode = 400;
        var result = http_status_code_to_errors_js_1.httpStatusCodeToErrors[httpCode];
        (0, globals_1.expect)(result).toBe(error_class_js_1.BadRequestError);
    });
    (0, globals_1.it)('should return gateway timeout error when given code 504', function () {
        var httpCode = 504;
        var result = http_status_code_to_errors_js_1.httpStatusCodeToErrors[httpCode];
        (0, globals_1.expect)(result).toBe(error_class_js_1.GatewayTimeoutError);
    });
});
