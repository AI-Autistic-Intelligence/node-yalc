import { LogLevel } from './logger.type.js';
/**
 * Safely obfuscates sensitive properties (e.g. passwords, tokens) within an object payload.
 * Useful for ensuring sensitive data does not accidentally leak into log aggregators.
 *
 * @param data The payload object to be masked. If a string is provided, it's wrapped in an object.
 * @param paths Array of object paths (e.g. `['user.password', 'token']`) that should be redacted.
 * @param trace Optional stack trace to append to the resulting object.
 * @returns The obfuscated object payload.
 */
export declare function maskDataInObject(data?: any, paths?: string[], trace?: any): any;
/**
 * Extracts and parses specific log levels from environment variables for a given context.
 * Expected format in ENV: `NEST_LOGGER_LEVELS_CONTEXTNAME="log,error,warn"`
 *
 * @param context The specific context to fetch environment overrides for.
 * @returns Array of parsed `LogLevel` values.
 */
export declare const getEnvLoggerLevelsByContext: (context: string) => LogLevel[];
/**
 * Determines the active log levels by checking context-specific overrides,
 * falling back to global overrides (`NEST_LOGGER_LEVELS`), and finally the provided defaults.
 *
 * @param context The current logger context.
 * @param def The default fallback levels if no environment variables are set.
 * @returns Array of resolved `LogLevel` values.
 */
export declare const getEnvLoggerLevels: (context?: string, def?: LogLevel[]) => LogLevel[];
