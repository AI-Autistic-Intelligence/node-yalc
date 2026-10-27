import { CacheStore } from '@node-yalc/storage';
import { Clock, SlidingWindowRateLimiter, systemClock } from '@node-yalc/resilience';

export interface FetchResponseLike {
  readonly ok: boolean;
  readonly status: number;
  json(): Promise<unknown>;
  text(): Promise<string>;
}

export type FetchLike = (
  url: string,
  init: { headers: Record<string, string>; signal: AbortSignal }
) => Promise<FetchResponseLike>;

export class UpstreamError extends Error {
  constructor(
    public readonly source: string,
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = 'UpstreamError';
  }
}

export interface UpstreamStats {
  readonly source: string;
  readonly baseUrl: string;
  readonly networkRequests: number;
  readonly cacheHits: number;
  readonly staleServed: number;
  readonly failures: number;
  readonly lastError: string | null;
  readonly lastSuccessAt: string | null;
}

export interface CachedHttpClientOptions {
  readonly source: string;
  readonly baseUrl: string;
  readonly limiter: SlidingWindowRateLimiter;
  readonly cache: CacheStore;
  readonly fetchFn?: FetchLike;
  readonly clock?: Clock;
  readonly userAgent?: string;
  readonly timeoutMs?: number;
  readonly maxRetries?: number;
  readonly backoffMs?: number;
}

export const FOREVER = Number.POSITIVE_INFINITY;

const defaultFetch: FetchLike = (url, init) => fetch(url, init);

/**
 * Rate-limited, cached, retrying JSON client used for real public or microservice APIs.
 * - cache-first with per-call TTL (Infinity for immutable historical data)
 * - in-flight de-duplication of identical URLs
 * - retries 429/5xx/network errors with exponential backoff
 * - stale-if-error: serves the last genuine payload when the upstream is down
 */
export class CachedHttpClient {
  private readonly inflight = new Map<string, Promise<unknown>>();
  private readonly fetchFn: FetchLike;
  private readonly clock: Clock;
  private stats = { networkRequests: 0, cacheHits: 0, staleServed: 0, failures: 0 };
  private lastError: string | null = null;
  private lastSuccessAt: string | null = null;

  constructor(private readonly opts: CachedHttpClientOptions) {
    this.fetchFn = opts.fetchFn ?? defaultFetch;
    this.clock = opts.clock ?? systemClock;
  }

  async getJson<T>(pathAndQuery: string, ttlMs: number): Promise<T> {
    const url = this.opts.baseUrl + pathAndQuery;
    const cached = await this.opts.cache.get(url);
    if (cached && this.clock.now() - cached.storedAt < ttlMs) {
      this.stats.cacheHits++;
      return cached.body as T;
    }
    const running = this.inflight.get(url);
    if (running) return running as Promise<T>;

    const task = (async () => {
      try {
        const body = await this.fetchWithRetry(url);
        await this.opts.cache.set(url, { storedAt: this.clock.now(), body });
        this.lastSuccessAt = new Date(this.clock.now()).toISOString();
        return body;
      } catch (err) {
        this.stats.failures++;
        this.lastError = (err as Error).message;
        if (cached) {
          this.stats.staleServed++;
          return cached.body;
        }
        throw err;
      } finally {
        this.inflight.delete(url);
      }
    })();

    this.inflight.set(url, task);
    return task as Promise<T>;
  }

  private async fetchWithRetry(url: string): Promise<unknown> {
    const maxRetries = this.opts.maxRetries ?? 3;
    const backoff = this.opts.backoffMs ?? 400;
    const timeout = this.opts.timeoutMs ?? 15_000;
    let attempt = 0;

    for (;;) {
      await this.opts.limiter.acquire();
      this.stats.networkRequests++;
      attempt++;
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeout);

      try {
        const res = await this.fetchFn(url, {
          headers: {
            Accept: 'application/json',
            'User-Agent': this.opts.userAgent ?? 'ferrox-client/1.0',
          },
          signal: ctrl.signal,
        });

        if (res.ok) {
          const text = await res.text();
          return text ? JSON.parse(text) : null;
        }

        const retryable = res.status === 429 || res.status >= 500;
        if (!retryable || attempt > maxRetries) {
          throw new UpstreamError(this.opts.source, res.status, `HTTP ${res.status} from ${this.opts.source}`);
        }
      } catch (err) {
        if (err instanceof UpstreamError) throw err;
        if (attempt > maxRetries) {
          throw new UpstreamError(this.opts.source, 502, `${this.opts.source} network error: ${(err as Error).message}`);
        }
      } finally {
        clearTimeout(timer);
      }

      await this.clock.sleep(backoff * 2 ** (attempt - 1));
    }
  }

  statsSnapshot(): UpstreamStats {
    return {
      source: this.opts.source,
      baseUrl: this.opts.baseUrl,
      ...this.stats,
      lastError: this.lastError,
      lastSuccessAt: this.lastSuccessAt,
    };
  }
}
