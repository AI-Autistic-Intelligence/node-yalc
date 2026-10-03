import { AppLoggerFactory } from '../logger.factory';
import { LoggerTypeEnum } from '../logger.enum';
import { ConsoleLogger } from '../logger-console.service';
import { PinoLogger } from '../logger-pino.service';

describe('AppLoggerFactory', () => {
  it('should instantiate ConsoleLogger by default', () => {
    const logger = AppLoggerFactory('test1');
    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it('should instantiate ConsoleLogger explicitly', () => {
    const logger = AppLoggerFactory('test2', undefined, LoggerTypeEnum.CONSOLE);
    expect(logger).toBeInstanceOf(ConsoleLogger);
  });

  it('should instantiate PinoLogger', () => {
    const logger = AppLoggerFactory('test3', undefined, LoggerTypeEnum.PINO);
    expect(logger).toBeInstanceOf(PinoLogger);
  });
});
