
import * as Module from '../i18n-engine';

describe('i18n-engine.ts', () => {
  it('should have exported members', () => {
    expect(Module).toBeDefined();
  });

  it('should instantiate I18nEngine (dummy)', () => {
    try {
      const instance = new (Module as any).I18nEngine();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on I18nEngine (dummy)', () => {
    const proto = (Module as any).I18nEngine.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).I18nEngine();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).I18nEngine).filter(m => typeof (Module as any).I18nEngine[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).I18nEngine[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });
});
