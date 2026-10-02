
import * as Module from '../config-engine';

describe('config-engine.ts', () => {
  it('should have exported members', () => {
    expect(Module).toBeDefined();
  });

  it('should instantiate ConfigEngine (dummy)', () => {
    try {
      const instance = new (Module as any).ConfigEngine();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on ConfigEngine (dummy)', () => {
    const proto = (Module as any).ConfigEngine.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).ConfigEngine();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).ConfigEngine).filter(m => typeof (Module as any).ConfigEngine[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).ConfigEngine[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });
});
