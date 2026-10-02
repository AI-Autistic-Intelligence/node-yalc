"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogLevelByStatus = getLogLevelByStatus;
exports.getLogLevelByError = getLogLevelByError;
exports.isErrorEvent = isErrorEvent;
const logger_1 = require("@node-yalc/logger");
const utils_1 = require("@node-yalc/utils");
const errors_1 = require("@node-yalc/errors");
const errors_2 = require("@node-yalc/errors");
function getLogLevelByStatus(statusCode) {
    let loggerLevel;
    switch (true) {
        case statusCode >= errors_1.HttpStatus.INTERNAL_SERVER_ERROR:
            loggerLevel = logger_1.LogLevelEnum.ERROR;
            break;
        case statusCode === errors_1.HttpStatus.TOO_MANY_REQUESTS:
            loggerLevel = logger_1.LogLevelEnum.WARN;
            break;
        case statusCode >= errors_1.HttpStatus.BAD_REQUEST:
        default:
            loggerLevel = logger_1.LogLevelEnum.LOG;
            break;
    }
    return loggerLevel;
}
function getLogLevelByError(error) {
    const statusCode = (0, errors_2.getStatusCodeFromError)(error);
    if (statusCode) {
        return getLogLevelByStatus(statusCode);
    }
    let _error;
    if ((0, utils_1.isClass)(error)) {
        _error = new error();
    }
    else {
        _error = error;
    }
    const httpException = _error;
    if (httpException.getStatus)
        return getLogLevelByStatus(httpException.getStatus());
    return _error.stack ? logger_1.LogLevelEnum.ERROR : logger_1.LogLevelEnum.LOG;
}
function isErrorEvent(options) {
    if (typeof options.logger === 'object' &&
        options.logger.level === logger_1.LogLevelEnum.ERROR) {
        return true;
    }
    if (!options.errorClass) {
        return false;
    }
    if (options.errorClass === true) {
        return true;
    }
    const logLevel = getLogLevelByError(options.errorClass);
    return logLevel === logger_1.LogLevelEnum.ERROR;
}
//# sourceMappingURL=event.helper.js.map