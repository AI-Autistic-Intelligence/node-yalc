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
export declare class CircuitBreaker {
    private failureThreshold;
    private recoveryTimeMs;
    private state;
    private failureCount;
    private lastFailureTime;
    /**
     * Initializes the Circuit Breaker.
     *
     * @param failureThreshold The number of consecutive failures before the circuit trips (opens).
     * @param recoveryTimeMs The duration in milliseconds to remain OPEN before shifting to HALF_OPEN.
     */
    constructor(failureThreshold?: number, recoveryTimeMs?: number);
    /**
     * Executes a potentially failing asynchronous function through the circuit breaker.
     *
     * @template T The expected return type of the wrapped function.
     * @param {() => Promise<T>} fn The asynchronous operation to wrap.
     * @param {() => T} [fallback] Optional synchronous fallback logic if the circuit is OPEN or fails.
     * @returns {Promise<T>} The successful result of `fn` or `fallback`.
     * @throws {Error} If execution fails and no fallback is provided, or if the circuit is OPEN.
     */
    execute<T>(fn: () => Promise<T>, fallback?: () => T): Promise<T>;
    /**
     * Internal routine to increment failure metrics and trip the circuit if needed.
     * @private
     */
    private recordFailure;
    /**
     * Manually resets the circuit breaker back to its baseline CLOSED state.
     */
    reset(): void;
    /**
     * Returns the current operational state of the circuit.
     * @returns {CircuitState}
     */
    getState(): CircuitState;
}
/**
 * Enterprise Token Bucket Rate Limiter.
 * Used to throttle API usage or heavy background jobs, preventing resource exhaustion.
 */
export declare class RateLimiter {
    private capacity;
    private refillRatePerSec;
    private tokens;
    private lastRefillTimestamp;
    /**
     * Initializes the Rate Limiter.
     *
     * @param capacity The maximum number of tokens the bucket can hold.
     * @param refillRatePerSec The number of tokens added back to the bucket every second.
     */
    constructor(capacity?: number, refillRatePerSec?: number);
    /**
     * Attempts to consume the specified number of tokens from the bucket.
     *
     * @param tokensRequested The number of tokens needed for the operation (default 1).
     * @returns {boolean} True if the tokens were successfully consumed; false if rate limited.
     */
    allowRequest(tokensRequested?: number): boolean;
    /**
     * Internal routine that mathematically calculates and adds tokens based on elapsed time.
     * @private
     */
    private refill;
}
/**
 * Enterprise Singleflight (Promise Coalescing) Pattern.
 * Prevents redundant concurrent executions of an identical heavy operation.
 * If 10 requests ask for the same data simultaneously, only 1 function execution occurs
 * and all 10 await the single shared promise.
 */
export declare class Singleflight {
    private inFlightCalls;
    /**
     * Executes a deduplicated function call keyed by a unique string.
     *
     * @template T The expected return type.
     * @param key A unique identifier representing the operation (e.g., 'getUser_123').
     * @param fn The heavy asynchronous function to execute if no flight is already active.
     * @returns {Promise<T>} The result of the operation.
     */
    do<T>(key: string, fn: () => Promise<T>): Promise<T>;
}
/**
 * Clock abstraction for deterministic time handling and testing.
 */
export interface Clock {
    now(): number;
    sleep(ms: number): Promise<void>;
}
export declare const systemClock: Clock;
/**
 * Quota window definition for sliding-window rate limiting.
 */
export interface RateWindow {
    readonly limit: number;
    readonly windowMs: number;
}
/**
 * Multi-window sliding log rate limiter with Promise serialization.
 * Protects downstream/upstream APIs against quota bursting across multiple intervals
 * (e.g. 3 req/sec and 30 req/min).
 */
export declare class SlidingWindowRateLimiter {
    private readonly windows;
    private readonly clock;
    private readonly stamps;
    private chain;
    private readonly horizon;
    constructor(windows: readonly RateWindow[], clock?: Clock);
    acquire(): Promise<void>;
    requiredWait(now: number): number;
    private waitForSlot;
}
