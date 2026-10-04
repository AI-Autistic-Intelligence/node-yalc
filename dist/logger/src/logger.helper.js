import { envToArray } from '../../utils/src/env.helper.js';
import fastRedact from 'fast-redact';
import { isEmpty } from 'lodash-es';
import { LOG_LEVEL_ALL, LoggerDefContext } from './logger.enum.js';
export function maskDataInObject(data, paths, trace) {
    if (typeof data === 'string')
        data = { message: data };
    if (!paths || !data || isEmpty(paths) || isEmpty(data)) {
        if (trace)
            data ? (data.trace = trace) : (data = { trace });
        return data;
    }
    const redact = fastRedact({
        paths,
    });
    return { ...JSON.parse(redact(data)), trace };
}
export const getEnvLoggerLevelsByContext = (context) => {
    return envToArray(`NEST_LOGGER_LEVELS_${context.toUpperCase()}`);
};
export const getEnvLoggerLevels = (context, def = LOG_LEVEL_ALL) => {
    let levels = getEnvLoggerLevelsByContext(context ?? LoggerDefContext.NEST_SYSTEM);
    if (!levels.length)
        levels = envToArray('NEST_LOGGER_LEVELS');
    return levels.length ? levels : def;
};
//# sourceMappingURL=logger.helper.js.map