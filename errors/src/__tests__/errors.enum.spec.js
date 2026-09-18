"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globals_1 = require("@jest/globals");
var error_enum_js_1 = require("../error.enum.js");
(0, globals_1.describe)('errors enum test', function () {
    (0, globals_1.it)('ErrorsEnum should have all the values', function () {
        (0, globals_1.expect)(Object.keys(error_enum_js_1.ErrorsEnum)).toEqual(globals_1.expect.arrayContaining([
            'BAD_LOGIN',
            'UNAUTHORIZED',
            'FORBIDDEN_RESOURCE',
            'INVALID_VALUE',
        ]));
    });
    (0, globals_1.it)('ExceptionContextEnum have all the values', function () {
        (0, globals_1.expect)(Object.keys(error_enum_js_1.ExceptionContextEnum)).toEqual([
            'DATABASE',
            'HTTP',
            'SYSTEM',
        ]);
    });
});
