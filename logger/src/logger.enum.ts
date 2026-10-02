/**
 * Enumeration representing standard logging levels.
 * These levels align with standard syslog and console paradigms.
 */
export enum LogLevelEnum {
  LOG = 'log',
  ERROR = 'error',
  WARN = 'warn',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

/**
 * Union type representing allowed logging levels, extending the standard enum with a 'fatal' level.
 */
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

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
export enum LoggerTypeEnum {
  CONSOLE = 'console',
  PINO = 'pino',
  NEST = 'nest-logger',
}

/**
 * Enumeration for predefined logging contexts.
 */
export enum LoggerDefContext {
  NEST_SYSTEM = 'system',
}
