import { LogLevel } from './logger.type.js';
import { IImprovedLoggerOptions, LoggerAbstractService } from './logger-abstract.service.js';
/**
 * Standard Console implementation of the LoggerAbstractService.
 * Directs all logs to the native Node.js `console` methods (log, error, debug, warn, info).
 * Automatically masks sensitive data defined in the `masks` option before printing.
 */
export declare class ConsoleLogger extends LoggerAbstractService {
    /**
     * Initializes the ConsoleLogger with native console method mappings.
     *
     * @param context The default logging context (e.g. the service name).
     * @param logLevels Array of enabled log levels.
     * @param options Additional logger options including masking and event configurations.
     */
    constructor(context: string, logLevels: LogLevel[] | undefined, options?: IImprovedLoggerOptions);
}
