import { LogLevel } from './logger.enum.js';
import type { IImprovedLoggerOptions, ImprovedLoggerService } from './logger-abstract.service.js';
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
export declare const AppLoggerFactory: (context: string, loggerLevels?: LogLevel[], loggerType?: string, options?: IImprovedLoggerOptions) => ImprovedLoggerService;
