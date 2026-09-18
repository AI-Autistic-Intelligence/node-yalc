"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerFactory = void 0;
const tslib_1 = require("tslib");
const logger_console_service_js_1 = require("./logger-console.service.js");
const logger_pino_service_js_1 = require("./logger-pino.service.js");
const logger_enum_js_1 = require("./logger.enum.js");
const _ = tslib_1.__importStar(require("lodash-es"));
exports.AppLoggerFactory = _.memoize((context, loggerLevels = logger_enum_js_1.LOG_LEVEL_DEFAULT, loggerType, options) => {
    let logger;
    switch (loggerType) {
        case logger_enum_js_1.LoggerTypeEnum.CONSOLE:
            logger = new logger_console_service_js_1.ConsoleLogger(context, loggerLevels, options);
            break;
        case logger_enum_js_1.LoggerTypeEnum.PINO:
            logger = new logger_pino_service_js_1.PinoLogger(context, loggerLevels, options);
            break;
        default:
            logger = new logger_console_service_js_1.ConsoleLogger(context, loggerLevels, options);
            break;
    }
    return logger;
}, (context, loggerLevels, loggerType, options) => `${context}-${loggerLevels?.join('-')}-${loggerType}-${options}`);
//# sourceMappingURL=logger.factory.js.map