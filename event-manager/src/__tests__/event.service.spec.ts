import { YalcEventService, injectTrace } from '../event.service';
import { EventEmitter2 } from 'eventemitter2';
import * as eventModule from '../event';
import { DefaultError } from '@node-yalc/errors';

// Mock event functions so we don't actually trigger everything
jest.mock('../event', () => {
  const original = jest.requireActual('../event');
  return {
    ...original,
    eventLogAsync: jest.fn(),
    eventDebugAsync: jest.fn(),
    eventErrorAsync: jest.fn(),
    eventVerboseAsync: jest.fn(),
    eventWarnAsync: jest.fn(),
    eventDebug: jest.fn(),
    eventError: jest.fn().mockReturnValue(new Error('Mocked')),
    eventLog: jest.fn(),
    eventVerbose: jest.fn(),
    eventWarn: jest.fn(),
  };
});

describe('event.service', () => {
  let loggerServiceMock: any;
  let eventEmitterMock: any;
  let service: YalcEventService;

  beforeEach(() => {
    loggerServiceMock = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };
    eventEmitterMock = new EventEmitter2();
    service = new YalcEventService(loggerServiceMock, eventEmitterMock, { formatter: jest.fn() });
    jest.clearAllMocks();
  });

  describe('injectTrace', () => {
    it('should inject stack if not present', () => {
      const opts = injectTrace();
      expect(opts?.stack).toBeDefined();
    });

    it('should not override existing stack', () => {
      const opts = injectTrace({ stack: 'my-stack' });
      expect(opts?.stack).toBe('my-stack');
    });
  });

  describe('base logs', () => {
    it('should call emit/log properly', () => {
      service.emit('test');
      service.log('test');
      expect(eventModule.eventLog).toHaveBeenCalledTimes(2);
    });

    it('should call emitAsync/logAsync properly', async () => {
      await service.emitAsync('test');
      await service.logAsync('test');
      expect(eventModule.eventLogAsync).toHaveBeenCalledTimes(2);
    });

    it('should call warn/warnAsync properly', async () => {
      service.warn('test');
      await service.warnAsync('test');
      expect(eventModule.eventWarn).toHaveBeenCalled();
      expect(eventModule.eventWarnAsync).toHaveBeenCalled();
    });

    it('should call debug/debugAsync properly', async () => {
      service.debug('test');
      await service.debugAsync('test');
      expect(eventModule.eventDebug).toHaveBeenCalled();
      expect(eventModule.eventDebugAsync).toHaveBeenCalled();
    });

    it('should call verbose/verboseAsync properly', async () => {
      service.verbose('test');
      await service.verboseAsync('test');
      expect(eventModule.eventVerbose).toHaveBeenCalled();
      expect(eventModule.eventVerboseAsync).toHaveBeenCalled();
    });

    it('should return getters properly', () => {
      expect(service.logger).toBe(loggerServiceMock);
      expect(service.emitter).toBe(eventEmitterMock);
    });
  });

  describe('base errors', () => {
    it('should call error properly', () => {
      service.error('testError');
      expect(eventModule.eventError).toHaveBeenCalled();
    });

    it('should call errorAsync properly', async () => {
      await service.errorAsync('testError');
      expect(eventModule.eventErrorAsync).toHaveBeenCalled();
    });

    it('should return errorResult properly', () => {
      const res = service.errorResult('testError');
      expect(res.isErr()).toBe(true);
    });

    it('should return errorFromFn properly - success', async () => {
      const res = await service.errorFromFn('testError', () => 'ok');
      expect(res.isOk()).toBe(true);
      expect(res._unsafeUnwrap()).toBe('ok');
    });

    it('should return errorFromFn properly - failure', async () => {
      const res = await service.errorFromFn('testError', () => { throw new Error('fail'); });
      expect(res.isErr()).toBe(true);
    });
  });

  describe('advanced errors', () => {
    it('should call errorHttp properly', () => {
      service.errorHttp('testHttp', 400);
      expect(eventModule.eventError).toHaveBeenCalled();
    });

    it('should call errorHttpResult properly', () => {
      const res = service.errorHttpResult('testHttp', 400);
      expect(res.isErr()).toBe(true);
    });

    it('should call errorForward properly', () => {
      const error = new DefaultError('test', { eventName: 'test' });
      service.errorForward('testForward', error);
      expect(eventModule.eventError).toHaveBeenCalled();
    });

    it('should call errorForwardResult properly', () => {
      const error = new DefaultError('test', { eventName: 'test' });
      const res = service.errorForwardResult('testForward', error);
      expect(res.isErr()).toBe(true);
    });

    it('should call errorForwardFromFn properly - success', async () => {
      const res = await service.errorForwardFromFn('testForward', () => 'ok');
      expect(res.isOk()).toBe(true);
    });

    it('should call errorForwardFromFn properly - failure', async () => {
      const res = await service.errorForwardFromFn('testForward', () => { throw new Error('fail'); });
      expect(res.isErr()).toBe(true);
    });
  });

  describe('specific errors', () => {
    const specificErrors = [
      'BadRequest',
      'Unauthorized',
      'PaymentRequired', // note: no fromFn/result
      'Forbidden',
      'NotFound',
      'MethodNotAllowed',
      'NotAcceptable',
      'Conflict',
      'Gone',
      'UnsupportedMediaType',
      'UnprocessableEntity',
      'TooManyRequests',
      'InternalServerError',
      'NotImplemented',
      'BadGateway',
      'ServiceUnavailable',
      'GatewayTimeout'
    ];

    for (const errType of specificErrors) {
      it(`should support ${errType}`, async () => {
        const errorMethod = (service as any)[`error${errType}`];
        if (typeof errorMethod === 'function') {
          errorMethod.call(service, 'testSpecific');
          errorMethod.call(service, 'testSpecific', { errorClass: true });
          expect(eventModule.eventError).toHaveBeenCalled();
        }

        const resultMethod = (service as any)[`error${errType}Result`];
        if (typeof resultMethod === 'function') {
          const res = resultMethod.call(service, 'testSpecific');
          const res2 = resultMethod.call(service, 'testSpecific', {});
          expect(res.isErr()).toBe(true);
        }

        const fromFnMethod = (service as any)[`error${errType}FromFn`];
        if (typeof fromFnMethod === 'function') {
          const resOk = await fromFnMethod.call(service, 'testSpecific', () => 'ok');
          const resOk2 = await fromFnMethod.call(service, 'testSpecific', () => 'ok', {});
          expect(resOk.isOk()).toBe(true);

          const resErr = await fromFnMethod.call(service, 'testSpecific', () => { throw new Error('fail'); });
          const resErr2 = await fromFnMethod.call(service, 'testSpecific', () => { throw new Error('fail'); }, {});
          expect(resErr.isErr()).toBe(true);
        }
      });
    }
  });

  describe('buildOptions branches', () => {
    it('should handle false event options', () => {
      service.log('test', { event: false });
      expect(eventModule.eventLog).toHaveBeenCalledWith('test', expect.objectContaining({ event: false }));
    });

    it('should handle false logger options', () => {
      service.log('test', { logger: false });
      expect(eventModule.eventLog).toHaveBeenCalledWith('test', expect.objectContaining({ logger: false }));
    });

    it('should handle cause in error options', () => {
      const causeError = new Error('Cause');
      service.error('test', { cause: causeError });
      expect(eventModule.eventError).toHaveBeenCalled();
    });

    it('should handle errorClass boolean true', () => {
      service.error('test', { errorClass: true } as any);
      expect(eventModule.eventError).toHaveBeenCalled();
    });
  });
});
