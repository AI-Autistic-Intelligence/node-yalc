import { envToArray } from '../../utils/src/env.helper.js';
import { LogLevel } from './logger.type.js';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fastRedact from 'fast-redact';
import { isEmpty } from 'lodash-es';
import { LOG_LEVEL_ALL, LoggerDefContext } from './logger.enum.js';

/**
 * Safely obfuscates sensitive properties (e.g. passwords, tokens) within an object payload.
 * Useful for ensuring sensitive data does not accidentally leak into log aggregators.
 *
 * @param data The payload object to be masked. If a string is provided, it's wrapped in an object.
 * @param paths Array of object paths (e.g. `['user.password', 'token']`) that should be redacted.
 * @param trace Optional stack trace to append to the resulting object.
 * @returns The obfuscated object payload.
 */
export function maskDataInObject(data?: any, paths?: string[], trace?: any) {
  if (typeof data === 'string') data = { message: data };

  if (!paths || !data || isEmpty(paths) || isEmpty(data)) {
    /* istanbul ignore next */
    if (trace) data ? (data.trace = trace) : (data = { trace });

    return data;
  }

  const redact = fastRedact({
    paths,
  });

  return { ...JSON.parse(redact(data)), trace };
}

/**
 * Extracts and parses specific log levels from environment variables for a given context.
 * Expected format in ENV: `NEST_LOGGER_LEVELS_CONTEXTNAME="log,error,warn"`
 * 
 * @param context The specific context to fetch environment overrides for.
 * @returns Array of parsed `LogLevel` values.
 */
export const getEnvLoggerLevelsByContext = (context: string): LogLevel[] => {
  return envToArray<LogLevel>(`NEST_LOGGER_LEVELS_${context.toUpperCase()}`);
};

/**
 * Determines the active log levels by checking context-specific overrides,
 * falling back to global overrides (`NEST_LOGGER_LEVELS`), and finally the provided defaults.
 *
 * @param context The current logger context.
 * @param def The default fallback levels if no environment variables are set.
 * @returns Array of resolved `LogLevel` values.
 */
export const getEnvLoggerLevels = (
  context?: string,
  def: LogLevel[] = LOG_LEVEL_ALL,
): LogLevel[] => {
  let levels = getEnvLoggerLevelsByContext(
    context ?? LoggerDefContext.NEST_SYSTEM,
  );

  if (!levels.length) levels = envToArray<LogLevel>('NEST_LOGGER_LEVELS');

  return levels.length ? levels : def;
};
