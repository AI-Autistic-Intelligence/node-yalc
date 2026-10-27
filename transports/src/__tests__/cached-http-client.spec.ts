import {
  CachedHttpClient,
  FOREVER,
  UpstreamError,
} from '../cached-http-client.js';
import { MemoryCacheStore } from '@node-yalc/storage';
import { SlidingWindowRateLimiter } from '@node-yalc/resilience';

describe('CachedHttpClient Suite', () => {
  it('should cache by TTL and serve forever-cached data', async () => {
    let now = 1000;
    const mockClock = {
      now: () => now,
      sleep: async (ms: number) => {
        now += ms;
      },
    };

    let callCount = 0;
    const mockFetch = jest.fn(async () => {
      callCount++;
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ payload: `data-${callCount}` }),
        json: async () => ({ payload: `data-${callCount}` }),
      };
    });

    const cache = new MemoryCacheStore();
    const limiter = new SlidingWindowRateLimiter([], mockClock);

    const client = new CachedHttpClient({
      source: 'test-api',
      baseUrl: 'https://api.test.dev',
      limiter,
      cache,
      fetchFn: mockFetch as any,
      clock: mockClock,
    });

    // Request 1: cache miss
    const res1 = await client.getJson<{ payload: string }>('/resource', 5000);
    expect(res1.payload).toBe('data-1');
    expect(callCount).toBe(1);

    // Request 2: within TTL (5000ms) -> cache hit
    now += 2000;
    const res2 = await client.getJson<{ payload: string }>('/resource', 5000);
    expect(res2.payload).toBe('data-1');
    expect(callCount).toBe(1);

    // Request 3: after TTL -> network fetch
    now += 4000; // total 6000ms elapsed
    const res3 = await client.getJson<{ payload: string }>('/resource', 5000);
    expect(res3.payload).toBe('data-2');
    expect(callCount).toBe(2);

    // Snapshot stats
    const stats = client.statsSnapshot();
    expect(stats.networkRequests).toBe(2);
    expect(stats.cacheHits).toBe(1);
    expect(stats.source).toBe('test-api');
  });

  it('should de-duplicate concurrent identical requests in-flight', async () => {
    let callCount = 0;
    const mockFetch = jest.fn(async () => {
      callCount++;
      await new Promise((r) => setTimeout(r, 50));
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ count: callCount }),
        json: async () => ({ count: callCount }),
      };
    });

    const client = new CachedHttpClient({
      source: 'dedup-api',
      baseUrl: 'https://api.dedup.dev',
      limiter: new SlidingWindowRateLimiter([]),
      cache: new MemoryCacheStore(),
      fetchFn: mockFetch as any,
    });

    const [p1, p2, p3] = await Promise.all([
      client.getJson<{ count: number }>('/shared', 1000),
      client.getJson<{ count: number }>('/shared', 1000),
      client.getJson<{ count: number }>('/shared', 1000),
    ]);

    expect(p1.count).toBe(1);
    expect(p2.count).toBe(1);
    expect(p3.count).toBe(1);
    expect(callCount).toBe(1);
  });

  it('should retry 429 and 5xx then succeed or serve stale on complete failure', async () => {
    let attempts = 0;
    const mockFetch = jest.fn(async () => {
      attempts++;
      if (attempts === 1) {
        return { ok: false, status: 500, text: async () => 'err', json: async () => ({}) };
      }
      return {
        ok: true,
        status: 200,
        text: async () => JSON.stringify({ success: true }),
        json: async () => ({ success: true }),
      };
    });

    const client = new CachedHttpClient({
      source: 'retry-api',
      baseUrl: 'https://api.retry.dev',
      limiter: new SlidingWindowRateLimiter([]),
      cache: new MemoryCacheStore(),
      fetchFn: mockFetch as any,
      backoffMs: 1,
    });

    const res = await client.getJson<{ success: boolean }>('/unstable', 1000);
    expect(res.success).toBe(true);
    expect(attempts).toBe(2);

    // Test stale fallback
    const failingFetch = jest.fn(async () => {
      return { ok: false, status: 500, text: async () => 'down', json: async () => ({}) };
    });
    const staleClient = new CachedHttpClient({
      source: 'stale-api',
      baseUrl: 'https://api.retry.dev',
      limiter: new SlidingWindowRateLimiter([]),
      cache: new MemoryCacheStore(),
      fetchFn: failingFetch as any,
      maxRetries: 1,
      backoffMs: 1,
    });

    // Populate cache first
    await (staleClient as any).opts.cache.set('https://api.retry.dev/stale-item', {
      storedAt: 100,
      body: { cached: 'old-payload' },
    });

    const staleRes = await staleClient.getJson<{ cached: string }>('/stale-item', 0); // 0 ttl forces refresh
    expect(staleRes.cached).toBe('old-payload');
  });

  it('should fail fast on 4xx client errors without retrying', async () => {
    let attempts = 0;
    const mockFetch = jest.fn(async () => {
      attempts++;
      return { ok: false, status: 404, text: async () => 'Not Found', json: async () => ({}) };
    });

    const client = new CachedHttpClient({
      source: 'client-err-api',
      baseUrl: 'https://api.test.dev',
      limiter: new SlidingWindowRateLimiter([]),
      cache: new MemoryCacheStore(),
      fetchFn: mockFetch as any,
    });

    await expect(client.getJson('/not-found', 1000)).rejects.toThrow(UpstreamError);
    expect(attempts).toBe(1);
  });
});
