/**
 * Union type representing allowed logging levels, extending standard syslogs with a 'fatal' level.
 */
export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose' | 'fatal';

/**
 * Standard interface for Logger services.
 * Any logger implementation (e.g., Console, Pino, custom) should implement this interface
 * to ensure consistency across the framework and compatibility with dependency injection.
 */
export interface LoggerService {
  /**
   * Logs a standard informational message.
   * @param message The primary message to log.
   * @param optionalParams Additional parameters or contextual data.
   */
  log(message: any, ...optionalParams: any[]): any;

  /**
   * Logs an error message indicating a failure or exception.
   * @param message The error message or Error object.
   * @param optionalParams Additional parameters or contextual data (e.g. stack trace).
   */
  error(message: any, ...optionalParams: any[]): any;

  /**
   * Logs a warning message indicating a potential issue that isn't immediately fatal.
   * @param message The warning message.
   * @param optionalParams Additional parameters or contextual data.
   */
  warn(message: any, ...optionalParams: any[]): any;

  /**
   * Logs a debug message, useful for detailed system state analysis during development.
   * @param message The debug message.
   * @param optionalParams Additional parameters or contextual data.
   */
  debug?(message: any, ...optionalParams: any[]): any;

  /**
   * Logs a verbose message for extremely detailed system tracing.
   * @param message The verbose message.
   * @param optionalParams Additional parameters or contextual data.
   */
  verbose?(message: any, ...optionalParams: any[]): any;

  /**
   * Logs a fatal system event, typically indicating a critical failure requiring immediate attention.
   * @param message The fatal error message.
   * @param optionalParams Additional parameters or contextual data.
   */
  fatal?(message: any, ...optionalParams: any[]): any;
}

/**
 * Interface representing the application shutdown lifecycle hook.
 * Implement this interface to perform graceful shutdown procedures, such as closing connections or flushing logs.
 */
export interface OnApplicationShutdown { 
  /**
   * Called when the application is shutting down.
   * @param signal The system signal (e.g., SIGTERM, SIGINT) that triggered the shutdown.
   */
  onApplicationShutdown(signal?: string): any; 
}
