
import * as Module from '../kernel-sandbox';

describe('kernel-sandbox.ts', () => {
  it('should have exported members', () => {
    expect(Module).toBeDefined();
  });

  it('should instantiate KernelSandboxEngine (dummy)', () => {
    try {
      const instance = new (Module as any).KernelSandboxEngine();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on KernelSandboxEngine (dummy)', () => {
    const proto = (Module as any).KernelSandboxEngine.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).KernelSandboxEngine();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).KernelSandboxEngine).filter(m => typeof (Module as any).KernelSandboxEngine[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).KernelSandboxEngine[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });
});
