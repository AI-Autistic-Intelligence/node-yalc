/**
 * Clock interface for time retrieval and async delay.
 */
export interface Clock {
  now(): number;
  sleep(ms: number): Promise<void>;
}

export const systemClock: Clock = {
  now: () => Date.now(),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

export interface RateWindow {
  readonly limit: number;
  readonly windowMs: number;
}

/**
 * Multi-window sliding log rate limiter.
 * Protects downstream services and APIs from exceeding multi-tiered rate limits
 * (e.g. 3 req/sec and 30 req/min).
 */
export class SlidingWindowRateLimiter {
  private readonly stamps: number[] = [];
  private chain: Promise<void> = Promise.resolve();
  private readonly horizon: number;

  constructor(
    private readonly windows: readonly RateWindow[],
    private readonly clock: Clock = systemClock
  ) {
    this.horizon = Math.max(0, ...windows.map((w) => w.windowMs));
  }

  /**
   * Sequentially acquire a rate-limited slot, waiting if necessary.
   */
  acquire(): Promise<void> {
    const next = this.chain.then(() => this.waitForSlot());
    this.chain = next;
    return next;
  }

  /**
   * Calculates required wait time in milliseconds given the current timestamp.
   */
  requiredWait(now: number): number {
    let wait = 0;
    for (const w of this.windows) {
      const recent = this.stamps.filter((t) => now - t < w.windowMs);
      if (recent.length >= w.limit) {
        const blocking = recent[recent.length - w.limit];
        wait = Math.max(wait, blocking + w.windowMs - now);
      }
    }
    return wait;
  }

  private async waitForSlot(): Promise<void> {
    for (;;) {
      const now = this.clock.now();
      const wait = this.requiredWait(now);
      if (wait <= 0) {
        this.stamps.push(now);
        while (this.stamps.length > 0 && now - this.stamps[0] >= this.horizon) {
          this.stamps.shift();
        }
        return;
      }
      await this.clock.sleep(wait);
    }
  }
}
