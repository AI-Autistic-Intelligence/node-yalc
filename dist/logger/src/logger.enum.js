/**
 * Enumeration representing standard logging levels.
 * These levels align with standard syslog and console paradigms.
 */
export var LogLevelEnum;
(function (LogLevelEnum) {
    LogLevelEnum["LOG"] = "log";
    LogLevelEnum["ERROR"] = "error";
    LogLevelEnum["WARN"] = "warn";
    LogLevelEnum["DEBUG"] = "debug";
    LogLevelEnum["VERBOSE"] = "verbose";
})(LogLevelEnum || (LogLevelEnum = {}));
/**
 * Default logging levels configuration.
 * Typically excludes 'verbose' and 'fatal' to optimize production logging noise.
 */
export const LOG_LEVEL_DEFAULT = [
    LogLevelEnum.DEBUG,
    LogLevelEnum.ERROR,
    LogLevelEnum.LOG,
    LogLevelEnum.WARN,
];
/**
 * Exhaustive array of all standard logging levels.
 * Useful for development environments where maximum verbosity is desired.
 */
export const LOG_LEVEL_ALL = [
    LogLevelEnum.DEBUG,
    LogLevelEnum.ERROR,
    LogLevelEnum.LOG,
    LogLevelEnum.VERBOSE,
    LogLevelEnum.WARN,
];
/**
 * Enumeration of available logging adapters/engines supported by the framework.
 */
export var LoggerTypeEnum;
(function (LoggerTypeEnum) {
    LoggerTypeEnum["CONSOLE"] = "console";
    LoggerTypeEnum["PINO"] = "pino";
    LoggerTypeEnum["NEST"] = "nest-logger";
})(LoggerTypeEnum || (LoggerTypeEnum = {}));
/**
 * Enumeration for predefined logging contexts.
 */
export var LoggerDefContext;
(function (LoggerDefContext) {
    LoggerDefContext["NEST_SYSTEM"] = "system";
})(LoggerDefContext || (LoggerDefContext = {}));
//# sourceMappingURL=logger.enum.js.map