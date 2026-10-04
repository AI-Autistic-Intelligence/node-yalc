import EventEmitter2Import from 'eventemitter2';
const EventEmitter2 = EventEmitter2Import.EventEmitter2 || EventEmitter2Import as any;
import { LogLevelEnum } from '@node-yalc/logger';
import { DefaultError, isDefaultErrorMixin } from '@node-yalc/errors';
import * as eventModule from '../event';
import * as globalEmitterModule from '../global-emitter';
import * as loggerHelper from '@node-yalc/logger/logger.helper';
import { globalPromiseTracker } from '@node-yalc/utils';
import { AppLoggerFactory } from '@node-yalc/logger/logger.factory';

jest.mock('@node-yalc/logger/logger.helper', () => ({
  maskDataInObject: jest.fn((data, mask) => ({ ...data, masked: true })),
}));

jest.mock('@node-yalc/logger/logger.factory', () => ({
  AppLoggerFactory: jest.fn().mockReturnValue({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  }),
}));

jest.mock('@node-yalc/utils', () => {
  const original = jest.requireActual('@node-yalc/utils');
  return {
    ...original,
    globalPromiseTracker: { add: jest.fn() },
    isClass: (cls: any) => typeof cls === 'function' && /^\s*class\s+/.test(cls.toString()),
    deepMergeWithoutArrayConcat: jest.fn((a, b) => ({ ...a, ...b })),
  };
});

describe('event', () => {
  let emitter: EventEmitter2;

  beforeEach(() => {
    emitter = new EventEmitter2();
    globalEmitterModule.setYalcGlobalEventEmitter(emitter);
    jest.spyOn(emitter, 'emit');
    jest.spyOn(emitter, 'emitAsync');
    jest.clearAllMocks();
  });

  describe('applyAwaitOption', () => {
    it('should set await to true by default when event is present but await is undefined', () => {
      const res = eventModule.applyAwaitOption({ event: {} });
      expect(res.event).toEqual({ await: true });
    });

    it('should keep await to false if explicitly set', () => {
      const res = eventModule.applyAwaitOption({ event: { await: false } });
      expect(res.event).toEqual({ await: false });
    });

    it('should not modify event if event is false', () => {
      const res = eventModule.applyAwaitOption({ event: false });
      expect(res.event).toBe(false);
    });
  });

  describe('isErrorOptions', () => {
    it('should return true if errorClass is defined', () => {
      expect(eventModule.isErrorOptions({ errorClass: true })).toBe(true);
      expect(eventModule.isErrorOptions({ errorClass: false })).toBe(true);
    });

    it('should return false if errorClass is undefined', () => {
      expect(eventModule.isErrorOptions({})).toBe(false);
    });
  });

  describe('event functions (eventLog, eventError, etc)', () => {
    it('eventLog should emit event and log', () => {
      eventModule.eventLog('testEvent', { data: 'my-data' });
      expect(emitter.emit).toHaveBeenCalledWith('testEvent', expect.objectContaining({
        eventName: 'testEvent',
        level: 'log',
      }));
    });

    it('eventLogAsync should await event and log', async () => {
      await eventModule.eventLogAsync('testEventAsync', { data: 'my-data', event: {} });
      expect(emitter.emitAsync).toHaveBeenCalledWith('testEventAsync', expect.objectContaining({
        eventName: 'testEventAsync',
        level: 'log',
      }));
    });

    it('eventWarn should emit warn', () => {
      eventModule.eventWarn('testWarn', { data: 'my-data' });
      expect(emitter.emit).toHaveBeenCalledWith('testWarn', expect.objectContaining({ level: 'warn' }));
    });

    it('eventWarnAsync should await warn', async () => {
      await eventModule.eventWarnAsync('testWarn', { data: 'my-data', event: {} });
      expect(emitter.emitAsync).toHaveBeenCalledWith('testWarn', expect.objectContaining({ level: 'warn' }));
    });

    it('eventDebug should emit debug', () => {
      eventModule.eventDebug('testDebug', { data: 'my-data' });
      expect(emitter.emit).toHaveBeenCalledWith('testDebug', expect.objectContaining({ level: 'debug' }));
    });

    it('eventDebugAsync should await debug', async () => {
      await eventModule.eventDebugAsync('testDebug', { data: 'my-data', event: {} });
      expect(emitter.emitAsync).toHaveBeenCalledWith('testDebug', expect.objectContaining({ level: 'debug' }));
    });

    it('eventVerbose should emit verbose', () => {
      eventModule.eventVerbose('testVerbose', { data: 'my-data' });
      expect(emitter.emit).toHaveBeenCalledWith('testVerbose', expect.objectContaining({ level: 'verbose' }));
    });

    it('eventVerboseAsync should await verbose', async () => {
      await eventModule.eventVerboseAsync('testVerbose', { data: 'my-data', event: {} });
      expect(emitter.emitAsync).toHaveBeenCalledWith('testVerbose', expect.objectContaining({ level: 'verbose' }));
    });

    it('eventError should return an error instance', () => {
      const error = eventModule.eventError('testError');
      expect(error).toBeInstanceOf(DefaultError);
      expect(emitter.emit).toHaveBeenCalled();
    });

    it('eventErrorAsync should return an error instance asynchronously', async () => {
      const error = await eventModule.eventErrorAsync('testErrorAsync', { event: {} });
      expect(error).toBeInstanceOf(DefaultError);
      expect(emitter.emitAsync).toHaveBeenCalled();
    });
  });

  describe('event core functionality', () => {
    it('should mask data if mask option is provided', () => {
      eventModule.event('testMask', { data: { secret: '123' }, mask: ['secret'] });
      expect(loggerHelper.maskDataInObject).toHaveBeenCalled();
    });

    it('should wrap string data in an object with message property', () => {
      eventModule.event('testString', { data: 'hello' });
      expect(emitter.emit).toHaveBeenCalledWith('testString', expect.objectContaining({
        data: expect.objectContaining({ message: 'hello', eventName: 'testString' }),
      }));
    });

    it('should handle custom errorClass instances', () => {
      const customError = new Error('Custom');
      const err = eventModule.event('testCustomError', { errorClass: customError });
      expect(err).toBe(customError);
    });

    it('should merge data into custom error instances that are not DefaultError', () => {
      const customError = new Error('Custom') as any;
      eventModule.event('testErrorMerge', { errorClass: customError, data: { foo: 'bar' } });
      expect(emitter.emit).toHaveBeenCalledWith('testErrorMerge', expect.objectContaining({
        errorInfo: expect.objectContaining({
          data: expect.objectContaining({ foo: 'bar' }),
        })
      }));
    });

    it('should use eventAliases if provided', () => {
      eventModule.event('mainEvent', { eventAliases: ['alias1', { eventName: 'alias2', await: false }] });
      expect(emitter.emit).toHaveBeenCalledWith('mainEvent', expect.any(Object));
      expect(emitter.emit).toHaveBeenCalledWith('alias1', expect.any(Object));
      expect(emitter.emit).toHaveBeenCalledWith('alias2', expect.any(Object));
    });

    it('getLoggerOption should resolve boolean false to false', () => {
      expect(eventModule.getLoggerOption(LogLevelEnum.LOG, { logger: false })).toBe(false);
    });

    it('resolveLoggerOption should resolve string to level', () => {
      expect(eventModule.resolveLoggerOption('error')).toEqual({ level: 'error' });
      expect(eventModule.resolveLoggerOption(false)).toBe(false);
    });
  });
});
