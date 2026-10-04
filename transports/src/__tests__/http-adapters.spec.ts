import { ExpressHttpAdapter, FastifyHttpAdapter } from '../http-adapters';
import * as http from 'http';

const sendReq = (port: number, method: string, path: string, body?: any): Promise<{ statusCode: number; body: string }> => {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ statusCode: res.statusCode || 200, body: data }));
      }
    );
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
};

describe('http-adapters', () => {
  let adapters: any[] = [];

  afterEach(async () => {
    for (const a of adapters) {
      await a.close();
    }
    adapters = [];
  });

  const testAdapter = (AdapterClass: any) => {
    it(`should handle requests correctly for ${AdapterClass.name}`, async () => {
      const adapter = new AdapterClass();
      adapters.push(adapter);

      adapter.registerRoute({
        method: 'GET',
        path: '/hello',
        handler: async (req: any, res: any) => {
          return { hello: 'world' };
        }
      });

      adapter.registerRoute({
        method: 'POST',
        path: '/echo',
        handler: async (req: any, res: any) => {
          res.setHeader('X-Custom', 'val');
          res.status(201);
          return req.body;
        }
      });

      adapter.registerRoute({
        method: 'GET',
        path: '/error',
        handler: async () => {
          throw new Error('Test Error');
        }
      });

      adapter.registerRoute({
        method: 'GET',
        path: '/error-empty',
        handler: async () => {
          throw 'Empty string error';
        }
      });

      adapter.registerRoute({
        method: 'GET',
        path: '/manual',
        handler: async (req: any, res: any) => {
          res.send('manual-string');
          return undefined; // Do not send json again
        }
      });

      adapter.registerRoute({
        method: 'GET',
        path: '/manual-obj',
        handler: async (req: any, res: any) => {
          res.send({ manual: 'object' });
          return undefined;
        }
      });

      // Test listen without host to trigger default parameter
      const emptyAdapter = new AdapterClass();
      await emptyAdapter.listen(0);
      await emptyAdapter.close();
      
      adapter.use('/', jest.fn());

      await adapter.listen(0, '127.0.0.1');
      const port = (adapter as any).server.address().port;

      // GET 200
      let res = await sendReq(port, 'GET', '/hello');
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toEqual({ hello: 'world' });

      // POST body
      res = await sendReq(port, 'POST', '/echo', { echo: 'me' });
      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res.body)).toEqual({ echo: 'me' });

      // POST empty body
      res = await sendReq(port, 'POST', '/echo');
      expect(res.statusCode).toBe(201);
      expect(JSON.parse(res.body)).toBeNull();

      // Error handling
      res = await sendReq(port, 'GET', '/error');
      expect(res.statusCode).toBe(500);

      // Error handling (no err.message)
      res = await sendReq(port, 'GET', '/error-empty');
      expect(res.statusCode).toBe(500);

      // Not found
      res = await sendReq(port, 'GET', '/non-existent');
      expect(res.statusCode).toBe(404);

      // Manual send
      res = await sendReq(port, 'GET', '/manual');
      expect(res.statusCode).toBe(200);
      expect(res.body).toBe('manual-string');

      res = await sendReq(port, 'GET', '/manual-obj');
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.body)).toEqual({ manual: 'object' });

      // Invalid JSON body
      const rawReq = new Promise((resolve) => {
        const req = http.request({ hostname: '127.0.0.1', port, path: '/echo', method: 'POST' }, (r) => {
          let d = ''; r.on('data', c => d+=c); r.on('end', () => resolve(d));
        });
        req.write('{invalid-json');
        req.end();
      });
      const invalidRes = await rawReq;
      expect(invalidRes).toBe('"{invalid-json"');

      // Test manual request without URL or host
      const serverInstance = (adapter as any).server as http.Server;
      const requestListener = serverInstance.listeners('request')[0] as (req: any, res: any) => void;
      
      const mockReq = {
        method: undefined, // Test fallback to GET
        headers: {}, // No host
        on: jest.fn(),
      } as any;
      const mockRes = {
        writeHead: jest.fn(),
        end: jest.fn(),
        writableEnded: false,
      } as any;
      
      await requestListener(mockReq, mockRes);
      
      const mockReq2 = {
        method: 'GET',
        url: '', // Falsy URL
        headers: {},
        on: jest.fn(),
      } as any;
      await requestListener(mockReq2, mockRes);
    });
  };

  testAdapter(ExpressHttpAdapter);
  testAdapter(FastifyHttpAdapter);
});
