"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var http_helper_js_1 = require("@node-yalc/utils/http.helper.js");
var error_class_js_1 = require("../error.class.js");
var index_js_1 = require("../index.js");
(0, globals_1.describe)('Verification error', function () {
    var error = new index_js_1.AdditionalVerificationNeededError();
    (0, globals_1.it)('should be defined', function () {
        (0, globals_1.expect)(error).toBeDefined();
    });
    (0, globals_1.it)('should have the correct message and code', function () {
        (0, globals_1.expect)(error.description).toEqual((0, http_helper_js_1.getHttpStatusDescription)(http_helper_js_1.HttpStatusCodes.UnavailableForLegalReasons));
        (0, globals_1.expect)(error.getStatus()).toEqual(http_helper_js_1.HttpStatusCodes.UnavailableForLegalReasons);
    });
    (0, globals_1.it)('should be an instance of HttpException', function () {
        (0, globals_1.expect)(error).toBeInstanceOf(error_class_js_1.HttpException);
    });
});
