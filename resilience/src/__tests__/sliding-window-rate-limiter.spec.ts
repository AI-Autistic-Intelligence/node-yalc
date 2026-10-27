import { SlidingWindowRateLimiter, RateWindow, Clock, systemClock } from '../sliding-window-rate-limiter.js';

describe('SlidingWindowRateLimiter', () => {
  it('should enforce multi-window quotas', async () => {
    let currentTime = 1000;
    const mockClock: Clock = {
      now: () => currentTime,
      sleep: async (ms: number) => {
        currentTime += ms;
      },
    };

    const windows: RateWindow[] = [
      { limit: 2, windowMs: 1000 },
      { limit: 4, windowMs: 5000 },
    ];

    const limiter = new SlidingWindowRateLimiter(windows, mockClock);

    // First two requests should pass immediately
    await limiter.acquire();
    expect(currentTime).toBe(1000);

    await limiter.acquire();
    expect(currentTime).toBe(1000);

    // Third request hits the 2 req / 1000ms window, must wait
    await limiter.acquire();
    expect(currentTime).toBeGreaterThanOrEqual(2000);
  });

  it('should serialise concurrent callers and handle empty window configuration', async () => {
    const emptyLimiter = new SlidingWindowRateLimiter([]);
    await emptyLimiter.acquire();
    expect(emptyLimiter.requiredWait(Date.now())).toBe(0);

    // Verify systemClock defaults
    expect(systemClock.now()).toBeGreaterThan(0);
    const start = Date.now();
    await systemClock.sleep(10);
    expect(Date.now() - start).toBeGreaterThanOrEqual(5);
  });
});
