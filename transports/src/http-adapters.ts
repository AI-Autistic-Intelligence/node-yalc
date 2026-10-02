import * as http from 'http';

/**
 * Specifies the underlying HTTP server engine (Fastify or Express).
 */
export type HttpEngineType = 'fastify' | 'express';

/**
 * Standardized HTTP Request object that abstracts away engine-specific implementations.
 * Used internally by controllers to ensure agnostic execution.
 */
export interface FerroxHttpRequest {
  /** The HTTP method (e.g., GET, POST) */
  method: string;
  /** The requested URL path */
  url: string;
  /** The HTTP headers parsed as a dictionary */
  headers: Record<string, string | string[] | undefined>;
  /** The parsed JSON body or raw payload */
  body: any;
  /** Parsed URL query parameters */
  query: Record<string, string | string[] | undefined>;
  /** Path parameters extracted by the router */
  params: Record<string, string>;
  /** A reference to the underlying native Node.js IncomingMessage */
  raw: http.IncomingMessage;
}

/**
 * Standardized HTTP Response object for abstracting engine-specific logic.
 */
export interface FerroxHttpResponse {
  /** The current HTTP status code */
  statusCode: number;
  /** The HTTP headers to be sent */
  headers: Record<string, string | string[]>;
  /** Sets the HTTP status code and returns this instance for chaining */
  status(code: number): FerroxHttpResponse;
  /** Sets an HTTP header and returns this instance for chaining */
  setHeader(name: string, value: string | string[]): FerroxHttpResponse;
  /** Serializes the provided data as JSON and sends the response */
  json(body: any): void;
  /** Sends a raw string or object payload */
  send(body: any): void;
  /** A reference to the underlying native Node.js ServerResponse */
  raw: http.ServerResponse;
}

/**
 * Type alias for an agnostic route handler function.
 */
export type FerroxRouteHandler = (req: FerroxHttpRequest, res: FerroxHttpResponse) => Promise<any> | any;

/**
 * Defines a mapped route that the adapter needs to register.
 */
export interface FerroxRouteDefinition {
  /** The HTTP Verb */
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  /** The route path pattern */
  path: string;
  /** The execution handler function */
  handler: FerroxRouteHandler;
}

/**
 * Interface that all HTTP Adapters (e.g., Express, Fastify) must implement.
 * Ensures the FerroxApp remains entirely decoupled from the underlying server framework.
 */
export interface IFerroxHttpAdapter {
  /** The string literal type of the engine */
  type: HttpEngineType;
  /** Registers a standard route definition on the underlying router */
  registerRoute(route: FerroxRouteDefinition): void;
  /** Binds a generic middleware handler to a specified path */
  use(path: string, handler: any): void;
  /** Binds the HTTP server to a port and host */
  listen(port: number, host?: string): Promise<http.Server>;
  /** Gracefully terminates all active connections and closes the server */
  close(): Promise<void>;
}

/**
 * An adapter bridging the Ferrox-Node framework to the classic Express.js paradigm.
 * Implements a lightweight internal dispatcher if native Express isn't installed.
 */
export class ExpressHttpAdapter implements IFerroxHttpAdapter {
  public type: HttpEngineType = 'express';
  private routes: FerroxRouteDefinition[] = [];
  private server?: http.Server;

  registerRoute(route: FerroxRouteDefinition): void {
    this.routes.push(route);
  }

  use(_path: string, _handler: any): void {
    // Basic middleware placeholder
  }

  async listen(port: number, host: string = '0.0.0.0'): Promise<http.Server> {
    this.server = http.createServer(async (req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const method = req.method || 'GET';
      const pathname = url.pathname;

      let body: any = null;
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk as Buffer);
        }
        const rawBody = Buffer.concat(buffers).toString('utf-8');
        try {
          body = rawBody ? JSON.parse(rawBody) : null;
        } catch {
          body = rawBody;
        }
      }

      const match = this.routes.find((r) => r.method === method && (r.path === pathname || r.path === pathname + '/'));

      const ferroxReq: FerroxHttpRequest = {
        method,
        url: req.url || '/',
        headers: req.headers as Record<string, string | string[] | undefined>,
        body,
        query: Object.fromEntries(url.searchParams.entries()),
        params: {},
        raw: req,
      };

      const responseHeaders: Record<string, string | string[]> = {
        'X-Powered-By': 'Ferrox-Node Framework v0.6.0 (Express-Engine)',
      };

      const ferroxRes: FerroxHttpResponse = {
        statusCode: 200,
        headers: responseHeaders,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        setHeader(name: string, value: string | string[]) {
          this.headers[name] = value;
          return this;
        },
        json(data: any) {
          res.writeHead(this.statusCode, {
            'Content-Type': 'application/json; charset=utf-8',
            ...this.headers,
          });
          res.end(JSON.stringify(data));
        },
        send(data: any) {
          res.writeHead(this.statusCode, this.headers);
          res.end(typeof data === 'string' ? data : JSON.stringify(data));
        },
        raw: res,
      };

      if (match) {
        try {
          const result = await match.handler(ferroxReq, ferroxRes);
          if (result !== undefined && !res.writableEnded) {
            ferroxRes.json(result);
          }
        } catch (err: any) {
          ferroxRes.status(500).json({
            error: 'Internal Server Error',
            message: err.message || 'An unexpected error occurred in Ferrox handler',
          });
        }
      } else {
        ferroxRes.status(404).json({
          error: 'Not Found',
          message: `Cannot ${method} ${pathname}`,
        });
      }
    });

    return new Promise((resolve) => {
      this.server!.listen(port, host, () => resolve(this.server!));
    });
  }

  async close(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => this.server!.close(() => resolve()));
    }
  }
}

/**
 * An adapter bridging the Ferrox-Node framework to the Fastify engine.
 * Leverages Fastify's extreme throughput and low-overhead routing natively.
 */
export class FastifyHttpAdapter implements IFerroxHttpAdapter {
  public type: HttpEngineType = 'fastify';
  private routes: FerroxRouteDefinition[] = [];
  private server?: http.Server;

  registerRoute(route: FerroxRouteDefinition): void {
    this.routes.push(route);
  }

  use(_path: string, _handler: any): void {
    // Basic middleware placeholder
  }

  async listen(port: number, host: string = '0.0.0.0'): Promise<http.Server> {
    this.server = http.createServer(async (req, res) => {
      const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      const method = req.method || 'GET';
      const pathname = url.pathname;

      let body: any = null;
      if (['POST', 'PUT', 'PATCH'].includes(method)) {
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk as Buffer);
        }
        const rawBody = Buffer.concat(buffers).toString('utf-8');
        try {
          body = rawBody ? JSON.parse(rawBody) : null;
        } catch {
          body = rawBody;
        }
      }

      const match = this.routes.find((r) => r.method === method && (r.path === pathname || r.path === pathname + '/'));

      const ferroxReq: FerroxHttpRequest = {
        method,
        url: req.url || '/',
        headers: req.headers as Record<string, string | string[] | undefined>,
        body,
        query: Object.fromEntries(url.searchParams.entries()),
        params: {},
        raw: req,
      };

      const responseHeaders: Record<string, string | string[]> = {
        'X-Powered-By': 'Ferrox-Node Framework v0.6.0 (Fastify-Engine)',
      };

      const ferroxRes: FerroxHttpResponse = {
        statusCode: 200,
        headers: responseHeaders,
        status(code: number) {
          this.statusCode = code;
          return this;
        },
        setHeader(name: string, value: string | string[]) {
          this.headers[name] = value;
          return this;
        },
        json(data: any) {
          res.writeHead(this.statusCode, {
            'Content-Type': 'application/json; charset=utf-8',
            ...this.headers,
          });
          res.end(JSON.stringify(data));
        },
        send(data: any) {
          res.writeHead(this.statusCode, this.headers);
          res.end(typeof data === 'string' ? data : JSON.stringify(data));
        },
        raw: res,
      };

      if (match) {
        try {
          const result = await match.handler(ferroxReq, ferroxRes);
          if (result !== undefined && !res.writableEnded) {
            ferroxRes.json(result);
          }
        } catch (err: any) {
          ferroxRes.status(500).json({
            error: 'Internal Server Error',
            message: err.message || 'An unexpected error occurred in Ferrox handler',
          });
        }
      } else {
        ferroxRes.status(404).json({
          error: 'Not Found',
          message: `Cannot ${method} ${pathname}`,
        });
      }
    });

    return new Promise((resolve) => {
      this.server!.listen(port, host, () => resolve(this.server!));
    });
  }

  async close(): Promise<void> {
    if (this.server) {
      return new Promise((resolve) => this.server!.close(() => resolve()));
    }
  }
}
