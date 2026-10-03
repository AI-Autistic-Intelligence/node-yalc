import { ConfigEngine } from '../config-engine';

describe('ConfigEngine', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should initialize with defaults', () => {
    const engine = new ConfigEngine({ 'DEFAULT_KEY': 'val' });
    expect(engine.get('DEFAULT_KEY')).toBe('val');
  });

  it('should parse environment variables', () => {
    const engine = new ConfigEngine();
    
    process.env.TEST_BOOL_TRUE = 'true';
    process.env.TEST_BOOL_FALSE = 'false';
    process.env.TEST_NUM = '42';
    process.env.TEST_STR = 'hello';
    
    expect(engine.get('TEST_BOOL_TRUE')).toBe(true);
    expect(engine.get('TEST_BOOL_FALSE')).toBe(false);
    expect(engine.get('TEST_NUM')).toBe(42);
    expect(engine.get('TEST_STR')).toBe('hello');
  });

  it('should manually set and get a value', () => {
    const engine = new ConfigEngine();
    engine.set('MY_KEY', 'my_val');
    expect(engine.get('MY_KEY')).toBe('my_val');
  });

  it('should fallback if key not found', () => {
    const engine = new ConfigEngine();
    expect(engine.get('MISSING_KEY', 'fallback')).toBe('fallback');
  });
});
