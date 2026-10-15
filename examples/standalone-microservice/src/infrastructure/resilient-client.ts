import { CircuitBreaker, Singleflight, RateLimiter } from '@node-yalc/resilience';
import { AppLoggerFactory } from '@node-yalc/logger';

const logger = AppLoggerFactory('ResilientClient');

export class ResilientClient {
  private circuitBreaker = new CircuitBreaker(3, 5000);
  private singleflight = new Singleflight();
  private rateLimiter = new RateLimiter(50, 10); // 50 capacity, 10 tokens/sec

  /**
   * Executes a remote call guarded by CircuitBreaker, Singleflight deduplication, and RateLimiter.
   */
  async executeGuardedCall<T>(key: string, callFn: () => Promise<T>): Promise<T> {
    // 1. Rate Limiting Check
    if (!this.rateLimiter.allowRequest(1)) {
      throw new Error(`Rate limit exceeded for client execution.`);
    }

    // 2. Singleflight Deduplication & 3. Circuit Breaker Isolation
    return await this.singleflight.do(key, async () => {
      return await this.circuitBreaker.execute(async () => {
        logger.log(`Executing protected call for key: ${key}`);
        return await callFn();
      });
    });
  }

  getCircuitState() {
    return this.circuitBreaker.getState();
  }
}
