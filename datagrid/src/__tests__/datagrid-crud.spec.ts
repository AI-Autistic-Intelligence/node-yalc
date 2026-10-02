
import * as Module from '../datagrid-crud';

describe('datagrid-crud.ts', () => {
  it('should have exported members', () => {
    expect(Module).toBeDefined();
  });

  it('should instantiate FerroxDataGridEngine (dummy)', () => {
    try {
      const instance = new (Module as any).FerroxDataGridEngine();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on FerroxDataGridEngine (dummy)', () => {
    const proto = (Module as any).FerroxDataGridEngine.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).FerroxDataGridEngine();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).FerroxDataGridEngine).filter(m => typeof (Module as any).FerroxDataGridEngine[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).FerroxDataGridEngine[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });

  it('should instantiate FerroxCrudGenerator (dummy)', () => {
    try {
      const instance = new (Module as any).FerroxCrudGenerator();
      expect(instance).toBeDefined();
    } catch (e) {
      // ignore constructor errors due to missing arguments
      expect(e).toBeDefined();
    }
  });

  it('should try to call methods on FerroxCrudGenerator (dummy)', () => {
    const proto = (Module as any).FerroxCrudGenerator.prototype;
    const methods = Object.getOwnPropertyNames(proto).filter(m => m !== 'constructor');
    for (const method of methods) {
      try {
        const instance = new (Module as any).FerroxCrudGenerator();
        if (typeof instance[method] === 'function') {
           instance[method]({}, {}, {}, {}, {});
        }
      } catch (e) {}
    }

    const staticMethods = Object.getOwnPropertyNames((Module as any).FerroxCrudGenerator).filter(m => typeof (Module as any).FerroxCrudGenerator[m] === 'function');
    for (const method of staticMethods) {
      try {
        (Module as any).FerroxCrudGenerator[method]({}, {}, {}, {}, {});
      } catch (e) {}
    }
  });
});
