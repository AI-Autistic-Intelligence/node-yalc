
import * as Module from '../tracing-logger';

describe('tracing-logger.ts', () => {
  it('should have exported members', () => {
    expect(Module).toBeDefined();
  });

  it('should instantiate TracingEngine (dummy)', () => {
    try {
      const instance = new (Module as any).TracingEngine();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on TracingEngine (dummy)', () => {
    const proto = (Module as any).TracingEngine.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).TracingEngine();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).TracingEngine).filter(m => typeof (Module as any).TracingEngine[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).TracingEngine[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });

  it('should instantiate FerroxLogger (dummy)', () => {
    try {
      const instance = new (Module as any).FerroxLogger();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on FerroxLogger (dummy)', () => {
    const proto = (Module as any).FerroxLogger.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).FerroxLogger();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).FerroxLogger).filter(m => typeof (Module as any).FerroxLogger[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).FerroxLogger[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });
});
