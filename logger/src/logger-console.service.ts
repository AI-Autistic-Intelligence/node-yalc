/* eslint-disable no-console */
import { LogLevel } from './logger.type.js';
import {
  IImprovedLoggerOptions,
  LoggerAbstractService,
} from './logger-abstract.service.js';
import { maskDataInObject } from './logger.helper.js';

/**
 * Utility to filter out undefined arguments before passing them to the console.
 */
const logOnlyDefined = (...args: any[]) => {
  return args.filter(function (element) {
    return element !== undefined;
  });
};

/**
 * Standard Console implementation of the LoggerAbstractService.
 * Directs all logs to the native Node.js `console` methods (log, error, debug, warn, info).
 * Automatically masks sensitive data defined in the `masks` option before printing.
 */
export class ConsoleLogger extends LoggerAbstractService {
  /**
   * Initializes the ConsoleLogger with native console method mappings.
   *
   * @param context The default logging context (e.g. the service name).
   * @param logLevels Array of enabled log levels.
   * @param options Additional logger options including masking and event configurations.
   */
  constructor(
    context: string,
    logLevels: LogLevel[] | undefined,
    options: IImprovedLoggerOptions = {},
  ) {
    super(
      context,
      logLevels,
      {
        log: (message, options, ...rest) =>
          console.log(
            ...logOnlyDefined(
              `[${options?.context ?? context}]`,
              message,
              maskDataInObject(options?.data, options?.masks, options?.stack),
              options?.config,
              ...rest,
            ),
          ),
        error: (message, trace, options, ...rest) =>
          console.error(
            ...logOnlyDefined(
              `[${options?.context ?? context}]`,
              message,
              trace,
              maskDataInObject(options?.data, options?.masks),
              options?.config,
              ...rest,
            ),
          ),
        debug: (message, options, ...rest) =>
          console.debug(
            ...logOnlyDefined(
              `[${options?.context ?? context}]`,
              message,
              maskDataInObject(options?.data, options?.masks, options?.stack),
              options?.config,
              ...rest,
            ),
          ),
        warn: (message, options, ...rest) =>
          console.warn(
            ...logOnlyDefined(
              `[${options?.context ?? context}]`,
              message,
              maskDataInObject(options?.data, options?.masks, options?.stack),
              options?.config,
              ...rest,
            ),
          ),
        verbose: (message, options, ...rest) =>
          console.info(
            ...logOnlyDefined(
              `[${options?.context ?? context}]`,
              message,
              maskDataInObject(options?.data, options?.masks, options?.stack),
              options?.config,
              ...rest,
            ),
          ),
      },
      options,
    );
  }
}
