import { TracingEngine, FerroxLogger } from '../tracing-logger';

describe('TracingEngine', () => {
  it('should create a valid trace context', () => {
    const ctx = TracingEngine.createTraceContext();
    expect(ctx.traceId.length).toBe(32);
    expect(ctx.spanId.length).toBe(16);
    expect(ctx.sampled).toBe(true);
  });

  it('should parse a valid traceparent header', () => {
    const header = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01';
    const ctx = TracingEngine.parseTraceparent(header);
    expect(ctx.traceId).toBe('4bf92f3577b34da6a3ce929d0e0e4736');
    expect(ctx.spanId).toBe('00f067aa0ba902b7');
    expect(ctx.sampled).toBe(true);
  });

  it('should parse a valid traceparent header with sampled 00', () => {
    const header = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00';
    const ctx = TracingEngine.parseTraceparent(header);
    expect(ctx.sampled).toBe(false);
  });

  it('should create new context if traceparent is empty or undefined', () => {
    const ctx1 = TracingEngine.parseTraceparent('');
    expect(ctx1.traceId.length).toBe(32);

    const ctx2 = TracingEngine.parseTraceparent(undefined);
    expect(ctx2.traceId.length).toBe(32);
  });

  it('should create new context if traceparent does not start with 00-', () => {
    const ctx = TracingEngine.parseTraceparent('invalid-header');
    expect(ctx.traceId.length).toBe(32);
  });

  it('should create new context if traceparent has invalid parts length', () => {
    const ctx = TracingEngine.parseTraceparent('00-4bf92f3577b34da6a3ce929d0e0e4736');
    expect(ctx.traceId).not.toBe('4bf92f3577b34da6a3ce929d0e0e4736'); // It generates a new one
  });

  it('should format traceparent correctly', () => {
    const ctx = {
      traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
      spanId: '00f067aa0ba902b7',
      sampled: true,
    };
    const header = TracingEngine.formatTraceparent(ctx);
    expect(header).toBe('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01');

    ctx.sampled = false;
    const header2 = TracingEngine.formatTraceparent(ctx);
    expect(header2).toBe('00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00');
  });
});

describe('FerroxLogger', () => {
  it('should log info, warn, error', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const logger = new FerroxLogger('test-service');
    const defaultLogger = new FerroxLogger();
    defaultLogger.info('default logger info');

    logger.info('info msg');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"level":"INFO"'));
    
    logger.warn('warn msg');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"level":"WARN"'));

    logger.error('error msg');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('"level":"ERROR"'));
    
    logSpy.mockRestore();
  });
});
