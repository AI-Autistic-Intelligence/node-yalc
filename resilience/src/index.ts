export * from './stub';

export class CircuitBreaker {
  async execute<T>(fn: () => Promise<T>): Promise<T> { return fn(); }
}
