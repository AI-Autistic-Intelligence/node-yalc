/**
 * Represents the current state of a Circuit Breaker.
 * - `CLOSED`: Operations are permitted (normal operation).
 * - `OPEN`: Operations are blocked because the failure threshold was exceeded.
 * - `HALF_OPEN`: Circuit is testing the underlying service to see if it recovered.
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Enterprise Circuit Breaker pattern.
 * Prevents catastrophic cascading failures by temporarily blocking execution of 
 * a degraded operation, giving the underlying service time to recover.
 */
export class CircuitBreaker {
  private failureThreshold: number;
  private recoveryTimeMs: number;
  private state: CircuitState = 'CLOSED';
  private failureCount: number = 0;
  private lastFailureTime: number = 0;

  /**
   * Initializes the Circuit Breaker.
   * 
   * @param failureThreshold The number of consecutive failures before the circuit trips (opens).
   * @param recoveryTimeMs The duration in milliseconds to remain OPEN before shifting to HALF_OPEN.
   */
  constructor(failureThreshold: number = 5, recoveryTimeMs: number = 10000) {
    this.failureThreshold = failureThreshold;
    this.recoveryTimeMs = recoveryTimeMs;
  }

  /**
   * Executes a potentially failing asynchronous function through the circuit breaker.
   * 
   * @template T The expected return type of the wrapped function.
   * @param {() => Promise<T>} fn The asynchronous operation to wrap.
   * @param {() => T} [fallback] Optional synchronous fallback logic if the circuit is OPEN or fails.
   * @returns {Promise<T>} The successful result of `fn` or `fallback`.
   * @throws {Error} If execution fails and no fallback is provided, or if the circuit is OPEN.
   */
  public async execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T> {
    const now = Date.now();

    if (this.state === 'OPEN') {
      if (now - this.lastFailureTime > this.recoveryTimeMs) {
        this.state = 'HALF_OPEN';
      } else {
        if (fallback) return fallback();
        throw new Error('CircuitBreaker is OPEN. Execution blocked.');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.reset();
      }
      return result;
    } catch (err) {
      this.recordFailure();
      if (fallback) return fallback();
      throw err;
    }
  }

  /**
   * Internal routine to increment failure metrics and trip the circuit if needed.
   * @private
   */
  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
    }
  }

  /**
   * Manually resets the circuit breaker back to its baseline CLOSED state.
   */
  public reset(): void {
    this.state = 'CLOSED';
    this.failureCount = 0;
  }

  /**
   * Returns the current operational state of the circuit.
   * @returns {CircuitState}
   */
  public getState(): CircuitState {
    return this.state;
  }
}

/**
 * Enterprise Token Bucket Rate Limiter.
 * Used to throttle API usage or heavy background jobs, preventing resource exhaustion.
 */
export class RateLimiter {
  private capacity: number;
  private refillRatePerSec: number;
  private tokens: number;
  private lastRefillTimestamp: number;

  /**
   * Initializes the Rate Limiter.
   * 
   * @param capacity The maximum number of tokens the bucket can hold.
   * @param refillRatePerSec The number of tokens added back to the bucket every second.
   */
  constructor(capacity: number = 100, refillRatePerSec: number = 10) {
    this.capacity = capacity;
    this.refillRatePerSec = refillRatePerSec;
    this.tokens = capacity;
    this.lastRefillTimestamp = Date.now();
  }

  /**
   * Attempts to consume the specified number of tokens from the bucket.
   * 
   * @param tokensRequested The number of tokens needed for the operation (default 1).
   * @returns {boolean} True if the tokens were successfully consumed; false if rate limited.
   */
  public allowRequest(tokensRequested: number = 1): boolean {
    this.refill();
    if (this.tokens >= tokensRequested) {
      this.tokens -= tokensRequested;
      return true;
    }
    return false;
  }

  /**
   * Internal routine that mathematically calculates and adds tokens based on elapsed time.
   * @private
   */
  private refill(): void {
    const now = Date.now();
    const elapsedSecs = (now - this.lastRefillTimestamp) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsedSecs * this.refillRatePerSec);
    this.lastRefillTimestamp = now;
  }
}

/**
 * Enterprise Singleflight (Promise Coalescing) Pattern.
 * Prevents redundant concurrent executions of an identical heavy operation.
 * If 10 requests ask for the same data simultaneously, only 1 function execution occurs
 * and all 10 await the single shared promise.
 */
export class Singleflight {
  private inFlightCalls: Map<string, Promise<any>> = new Map();

  /**
   * Executes a deduplicated function call keyed by a unique string.
   * 
   * @template T The expected return type.
   * @param key A unique identifier representing the operation (e.g., 'getUser_123').
   * @param fn The heavy asynchronous function to execute if no flight is already active.
   * @returns {Promise<T>} The result of the operation.
   */
  public async do<T>(key: string, fn: () => Promise<T>): Promise<T> {
    if (this.inFlightCalls.has(key)) {
      return this.inFlightCalls.get(key) as Promise<T>;
    }

    const promise = (async () => {
      try {
        return await fn();
      } finally {
        this.inFlightCalls.delete(key);
      }
    })();

    this.inFlightCalls.set(key, promise);
    return promise;
  }
}
