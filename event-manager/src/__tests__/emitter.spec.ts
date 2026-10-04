import EventEmitter2Import from 'eventemitter2';
const EventEmitter2 = EventEmitter2Import.EventEmitter2 || EventEmitter2Import as any;
import {
  emitEvent,
  emitFormattedEvent,
  formatName,
  simpleDotFormatter,
  simpleFormatter,
  versionedDomainActionFormatter,
} from '../emitter';
import { globalPromiseTracker } from '@node-yalc/utils';
import * as logger from '@node-yalc/logger';

jest.mock('@node-yalc/logger', () => ({
  maskDataInObject: jest.fn((payload, mask) => ({ ...payload, masked: true })),
}));

describe('emitter', () => {
  let eventEmitter: EventEmitter2;

  beforeEach(() => {
    eventEmitter = new EventEmitter2();
    jest.spyOn(eventEmitter, 'emit');
    jest.spyOn(eventEmitter, 'emitAsync');
    jest.spyOn(globalPromiseTracker, 'add').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatName', () => {
    it('should return simple string when no formatter', () => {
      expect(formatName('testEvent')).toBe('testEvent');
    });

    it('should join array when no formatter', () => {
      expect(formatName(['test', 'event'])).toBe('test,event');
    });

    it('should use formatter when provided', () => {
      expect(formatName(['test'], simpleFormatter)).toBe('ontest');
    });
  });

  describe('emitEvent', () => {
    it('should emit event synchronously by default', async () => {
      const payload = { data: 'test' };
      await emitEvent(eventEmitter, 'myEvent', payload);
      expect(eventEmitter.emit).toHaveBeenCalledWith('myEvent', payload);
      expect(eventEmitter.emitAsync).not.toHaveBeenCalled();
    });

    it('should mask payload when mask option is provided', async () => {
      const payload = { data: 'test', secret: 'abc' };
      await emitEvent(eventEmitter, 'myEvent', payload, { mask: ['secret'] });
      expect(logger.maskDataInObject).toHaveBeenCalledWith(payload, ['secret']);
      expect(eventEmitter.emit).toHaveBeenCalledWith('myEvent', { ...payload, masked: true });
    });

    it('should emit event asynchronously and add to tracker when await option is true', async () => {
      const payload = { data: 'test' };
      await emitEvent(eventEmitter, 'myEvent', payload, { await: true });
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith('myEvent', payload);
      expect(globalPromiseTracker.add).toHaveBeenCalled();
    });
  });

  describe('emitFormattedEvent', () => {
    it('should use simpleFormatter and emit event', async () => {
      const payload = { data: 'test' };
      await emitFormattedEvent(eventEmitter, 'Test', payload);
      expect(eventEmitter.emit).toHaveBeenCalledWith('onTest', payload);
    });
    
    it('should pass options properly to emitEvent', async () => {
      const payload = { data: 'test' };
      await emitFormattedEvent(eventEmitter, 'Test', payload, { await: true });
      expect(eventEmitter.emitAsync).toHaveBeenCalledWith('onTest', payload);
    });
  });

  describe('formatters', () => {
    it('versionedDomainActionFormatter should format correctly with when', () => {
      expect(versionedDomainActionFormatter('v1', 'user', 'create', 'onSuccess')).toBe('v1.user.create.onSuccess');
    });

    it('versionedDomainActionFormatter should format correctly without when', () => {
      expect(versionedDomainActionFormatter('v1', 'user', 'create')).toBe('v1.user.create.onProcess');
    });

    it('simpleDotFormatter should format correctly', () => {
      expect(simpleDotFormatter('a', 'b', 'c')).toBe('a.b.c');
    });
  });
});
