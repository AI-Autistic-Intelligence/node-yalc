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
  (
    context: string,
    loggerLevels: LogLevel[] | undefined,
    loggerType: string | undefined,
    options: IImprovedLoggerOptions | undefined,
  ): string => `${context}-${loggerLevels?.join('-')}-${loggerType}-${options}`,
);

