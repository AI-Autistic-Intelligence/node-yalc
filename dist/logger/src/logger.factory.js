import { ConsoleLogger } from './logger-console.service.js';
import { PinoLogger } from './logger-pino.service.js';
import { LoggerTypeEnum, LOG_LEVEL_DEFAULT } from './logger.enum.js';
import * as _ from 'lodash-es';
export const AppLoggerFactory = _.memoize((context, loggerLevels = LOG_LEVEL_DEFAULT, loggerType, options) => {
    let logger;
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
}, (context, loggerLevels, loggerType, options) => `${context}-${loggerLevels?.join('-')}-${loggerType}-${options}`);
//# sourceMappingURL=logger.factory.js.map