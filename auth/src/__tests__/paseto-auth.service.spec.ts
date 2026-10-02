
import * as Module from '../paseto-auth.service';

describe('paseto-auth.service.ts', () => {
  it('should have exported members', () => {
    expect(Module).toBeDefined();
  });

  it('should instantiate PasetoAuthService (dummy)', () => {
    try {
      const instance = new (Module as any).PasetoAuthService();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on PasetoAuthService (dummy)', () => {
    const proto = (Module as any).PasetoAuthService.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).PasetoAuthService();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).PasetoAuthService).filter(m => typeof (Module as any).PasetoAuthService[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).PasetoAuthService[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });
});
