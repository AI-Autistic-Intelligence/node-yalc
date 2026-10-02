import { ExpressHttpAdapter, FastifyHttpAdapter } from '../http-adapters';
import * as http from 'http';

describe('http-adapters', () => {
  it('should instantiate ExpressHttpAdapter', () => {
    const adapter = new ExpressHttpAdapter();
    expect(adapter.type).toBe('express');
    adapter.registerRoute({ method: 'GET', path: '/', handler: jest.fn() });
    adapter.use('/', jest.fn());
  });

  it('should instantiate FastifyHttpAdapter', () => {
    const adapter = new FastifyHttpAdapter();
    expect(adapter.type).toBe('fastify');
    adapter.registerRoute({ method: 'GET', path: '/', handler: jest.fn() });
    adapter.use('/', jest.fn());
  });
});
