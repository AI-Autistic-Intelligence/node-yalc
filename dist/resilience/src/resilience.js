/**
 * Enterprise Circuit Breaker pattern.
 * Prevents catastrophic cascading failures by temporarily blocking execution of
 * a degraded operation, giving the underlying service time to recover.
 */
export class CircuitBreaker {
    /**
     * Initializes the Circuit Breaker.
     *
     * @param failureThreshold The number of consecutive failures before the circuit trips (opens).
     * @param recoveryTimeMs The duration in milliseconds to remain OPEN before shifting to HALF_OPEN.
     */
    constructor(failureThreshold = 5, recoveryTimeMs = 10000) {
        this.state = 'CLOSED';
        this.failureCount = 0;
        this.lastFailureTime = 0;
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
    async execute(fn, fallback) {
        const now = Date.now();
        if (this.state === 'OPEN') {
            if (now - this.lastFailureTime > this.recoveryTimeMs) {
                this.state = 'HALF_OPEN';
            }
            else {
                if (fallback)
                    return fallback();
                throw new Error('CircuitBreaker is OPEN. Execution blocked.');
            }
        }
        try {
            const result = await fn();
            if (this.state === 'HALF_OPEN') {
                this.reset();
            }
            return result;
        }
        catch (err) {
            this.recordFailure();
            if (fallback)
                return fallback();
            throw err;
        }
    }
    /**
     * Internal routine to increment failure metrics and trip the circuit if needed.
     * @private
     */
    recordFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
    /**
     * Manually resets the circuit breaker back to its baseline CLOSED state.
     */
    reset() {
        this.state = 'CLOSED';
        this.failureCount = 0;
    }
    /**
     * Returns the current operational state of the circuit.
     * @returns {CircuitState}
     */
    getState() {
        return this.state;
    }
}
/**
 * Enterprise Token Bucket Rate Limiter.
 * Used to throttle API usage or heavy background jobs, preventing resource exhaustion.
 */
export class RateLimiter {
    /**
     * Initializes the Rate Limiter.
     *
     * @param capacity The maximum number of tokens the bucket can hold.
     * @param refillRatePerSec The number of tokens added back to the bucket every second.
     */
    constructor(capacity = 100, refillRatePerSec = 10) {
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
    allowRequest(tokensRequested = 1) {
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
    refill() {
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
    constructor() {
        this.inFlightCalls = new Map();
    }
    /**
     * Executes a deduplicated function call keyed by a unique string.
     *
     * @template T The expected return type.
     * @param key A unique identifier representing the operation (e.g., 'getUser_123').
     * @param fn The heavy asynchronous function to execute if no flight is already active.
     * @returns {Promise<T>} The result of the operation.
     */
    async do(key, fn) {
        if (this.inFlightCalls.has(key)) {
            return this.inFlightCalls.get(key);
        }
        const promise = (async () => {
            try {
                return await fn();
            }
            finally {
                this.inFlightCalls.delete(key);
            }
        })();
        this.inFlightCalls.set(key, promise);
        return promise;
    }
}
export const systemClock = {
    now: () => Date.now(),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};
/**
 * Multi-window sliding log rate limiter with Promise serialization.
 * Protects downstream/upstream APIs against quota bursting across multiple intervals
 * (e.g. 3 req/sec and 30 req/min).
 */
export class SlidingWindowRateLimiter {
    constructor(windows, clock = systemClock) {
        this.windows = windows;
        this.clock = clock;
        this.stamps = [];
        this.chain = Promise.resolve();
        this.horizon = Math.max(0, ...windows.map((w) => w.windowMs));
    }
    acquire() {
        const next = this.chain.then(() => this.waitForSlot());
        this.chain = next;
        return next;
    }
    requiredWait(now) {
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
    async waitForSlot() {
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
//# sourceMappingURL=resilience.js.map