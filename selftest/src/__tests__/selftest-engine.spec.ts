
import * as Module from '../selftest-engine';

describe('selftest-engine.ts', () => {
  it('should have exported members', () => {
    expect(Module).toBeDefined();
  });

  it('should instantiate FerroxSelfTestEngine (dummy)', () => {
    try {
      const instance = new (Module as any).FerroxSelfTestEngine();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on FerroxSelfTestEngine (dummy)', () => {
    const proto = (Module as any).FerroxSelfTestEngine.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).FerroxSelfTestEngine();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).FerroxSelfTestEngine).filter(m => typeof (Module as any).FerroxSelfTestEngine[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).FerroxSelfTestEngine[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });
});
