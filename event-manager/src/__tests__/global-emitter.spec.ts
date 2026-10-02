import { EventEmitter2 } from 'eventemitter2';
import {
  createGlobalEventEmitter,
  getYalcGlobalEventEmitter,
  setYalcGlobalEventEmitter,
  yalcStaticEventEmitter,
} from '../global-emitter';

describe('global-emitter', () => {
  beforeEach(() => {
    // Reset state before each test
    setYalcGlobalEventEmitter(yalcStaticEventEmitter);
  });

  it('createGlobalEventEmitter should return a new EventEmitter2 instance with correct config', () => {
    const emitter = createGlobalEventEmitter();
    expect(emitter).toBeInstanceOf(EventEmitter2);
    // Hard to check internal private config, but we verify it's an emitter instance
    expect(typeof emitter.emit).toBe('function');
  });

  it('yalcStaticEventEmitter should be an instance of EventEmitter2', () => {
    expect(yalcStaticEventEmitter).toBeInstanceOf(EventEmitter2);
  });

  it('getYalcGlobalEventEmitter should return the current emitter', () => {
    const emitter = getYalcGlobalEventEmitter();
    expect(emitter).toBe(yalcStaticEventEmitter);
  });

  it('setYalcGlobalEventEmitter should override the current emitter', () => {
    const newEmitter = new EventEmitter2();
    setYalcGlobalEventEmitter(newEmitter);
    expect(getYalcGlobalEventEmitter()).toBe(newEmitter);
    expect(getYalcGlobalEventEmitter()).not.toBe(yalcStaticEventEmitter);
  });

  it('getYalcGlobalEventEmitter should fallback to static emitter if nullified', () => {
    setYalcGlobalEventEmitter(null as any);
    const emitter = getYalcGlobalEventEmitter();
    expect(emitter).toBe(yalcStaticEventEmitter);
  });
});
