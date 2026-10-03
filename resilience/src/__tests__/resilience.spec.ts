import { CircuitBreaker, RateLimiter, Singleflight } from '../resilience';

describe('CircuitBreaker', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should execute successfully when CLOSED', async () => {
    const cb = new CircuitBreaker();
    const result = await cb.execute(async () => 'ok');
    expect(result).toBe('ok');
    expect(cb.getState()).toBe('CLOSED');
  });

  it('should trip to OPEN after threshold failures', async () => {
    const cb = new CircuitBreaker(2, 1000);
    const failFn = async () => { throw new Error('fail'); };
    
    await expect(cb.execute(failFn)).rejects.toThrow('fail');
    expect(cb.getState()).toBe('CLOSED'); // 1 failure
    
    await expect(cb.execute(failFn)).rejects.toThrow('fail');
    expect(cb.getState()).toBe('OPEN'); // 2 failures -> trips!
    
    // Now it should reject immediately with OPEN error
    await expect(cb.execute(failFn)).rejects.toThrow('CircuitBreaker is OPEN. Execution blocked.');
    
    // With fallback
    const fallback = () => 'fallback';
    expect(await cb.execute(failFn, fallback)).toBe('fallback');
  });

  it('should transition to HALF_OPEN after recovery time and then close on success', async () => {
    const cb = new CircuitBreaker(1, 1000);
    const failFn = async () => { throw new Error('fail'); };
    
    await expect(cb.execute(failFn)).rejects.toThrow('fail');
    expect(cb.getState()).toBe('OPEN');

    // Advance time past recovery
    jest.advanceTimersByTime(1001);
    
    // Now it should attempt execution (HALF_OPEN)
    const result = await cb.execute(async () => 'recovered');
    expect(result).toBe('recovered');
    expect(cb.getState()).toBe('CLOSED'); // success -> reset
  });

  it('should return fallback on internal failure if provided', async () => {
    const cb = new CircuitBreaker(5);
    const failFn = async () => { throw new Error('fail'); };
    const fallback = () => 'fallback';
    const result = await cb.execute(failFn, fallback);
    expect(result).toBe('fallback');
  });
});

describe('RateLimiter', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow requests within capacity', () => {
    const rl = new RateLimiter(2, 1);
    expect(rl.allowRequest(1)).toBe(true);
    expect(rl.allowRequest(1)).toBe(true);
    expect(rl.allowRequest(1)).toBe(false); // exhausted
  });

  it('should refill tokens over time', () => {
    const rl = new RateLimiter(2, 2); // 2 per second
    expect(rl.allowRequest(2)).toBe(true);
    expect(rl.allowRequest(1)).toBe(false); // exhausted

    // advance half second -> 1 token refilled
    jest.advanceTimersByTime(500);
    expect(rl.allowRequest(1)).toBe(true);
    expect(rl.allowRequest(1)).toBe(false); // exhausted again
  });

  it('should use default parameters', () => {
    const rl = new RateLimiter(); // defaults to 100 capacity
    expect(rl.allowRequest()).toBe(true); // defaults to 1 token
  });
});

describe('Singleflight', () => {
  it('should coalesce multiple calls to the same key into a single promise', async () => {
    const sf = new Singleflight();
    let calls = 0;
    
    const slowFn = async () => {
      calls++;
      await new Promise(r => setTimeout(r, 50));
      return 'data';
    };

    const p1 = sf.do('key1', slowFn);
    const p2 = sf.do('key1', slowFn);
    const p3 = sf.do('key2', async () => 'other');

    const [r1, r2, r3] = await Promise.all([p1, p2, p3]);
    
    expect(r1).toBe('data');
    expect(r2).toBe('data');
    expect(r3).toBe('other');
    expect(calls).toBe(1); // 'key1' was only executed once!
  });

  it('should propagate errors to all coalesced callers', async () => {
    const sf = new Singleflight();
    let calls = 0;
    
    const slowFail = async () => {
      calls++;
      await new Promise(r => setTimeout(r, 10));
      throw new Error('shared fail');
    };

    const p1 = sf.do('failKey', slowFail);
    const p2 = sf.do('failKey', slowFail);

    await expect(p1).rejects.toThrow('shared fail');
    await expect(p2).rejects.toThrow('shared fail');
    expect(calls).toBe(1);
  });
});
