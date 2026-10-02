import { ConsoleLogger } from './logger-console.service.js';
import { PinoLogger } from './logger-pino.service.js';
import { LogLevel } from './logger.enum.js';
import { LoggerTypeEnum, LOG_LEVEL_DEFAULT } from './logger.enum.js';

import type {
  IImprovedLoggerOptions,
  ImprovedLoggerService,
} from './logger-abstract.service.js';
import * as _ from 'lodash-es';
// import { getEnvLoggerLevels } from './logger.helper.js';

/**
 * Factory function to instantiate loggers dynamically based on configuration.
 * Memoized via Lodash to ensure that the same logger instance is returned for identical configurations,
 * preventing unnecessary memory allocations and redundant instances across the application.
 *
 * @param context The specific context for this logger (e.g., 'Bootstrap', 'HttpExceptionFilter').
 * @param loggerLevels Array of enabled log levels. Defaults to `LOG_LEVEL_DEFAULT`.
 * @param loggerType The underlying logger implementation ('console', 'pino', etc.). Defaults to 'console' if not specified or invalid.
 * @param options Additional global options for the logger.
 * @returns An instance of `ImprovedLoggerService` implementing the requested logic.
 */
export const AppLoggerFactory: (
  context: string,
  loggerLevels?: LogLevel[],
  loggerType?: string,
  options?: IImprovedLoggerOptions,
) => ImprovedLoggerService = _.memoize(
  (
    context: string,
    loggerLevels: LogLevel[] = LOG_LEVEL_DEFAULT,
    loggerType?: string,
    options?: IImprovedLoggerOptions,
  ): ImprovedLoggerService => {
    let logger: ImprovedLoggerService;
    switch (loggerType) {
      case LoggerTypeEnum.CONSOLE:
        logger = new ConsoleLogger(context, loggerLevels, options);
        break;
      case LoggerTypeEnum.PINO:
        logger = new PinoLogger(context, loggerLevels, options);
        break;
      default:
        logger = new ConsoleLogger(context, loggerLevels, options);
        break;
    }

    return logger;
  },
  /**
   * Cache key resolver for memoization.
   */
  (
    context: string,
    loggerLevels: LogLevel[] | undefined,
    loggerType: string | undefined,
    options: IImprovedLoggerOptions | undefined,
  ): string => `${context}-${loggerLevels?.join('-')}-${loggerType}-${options}`,
);

