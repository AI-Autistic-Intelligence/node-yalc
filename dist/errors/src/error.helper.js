"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatusCodeFromError = getStatusCodeFromError;
const utils_1 = require("@node-yalc/utils");
const default_error_js_1 = require("./default.error.js");
const error_class_js_1 = require("./error.class.js");
function getStatusCodeFromError(error) {
    if (!(0, utils_1.isClass)(error)) {
        if (error.getStatus) {
            return error.getStatus();
        }
        return null;
    }
    if ((0, default_error_js_1.isDefaultErrorMixinClass)(error)) {
        return error.defaultStatusCode;
    }
    const errorName = error.name;
    return error_class_js_1.httpExceptionStatusCodes[errorName] || null;
}
//# sourceMappingURL=error.helper.js.map