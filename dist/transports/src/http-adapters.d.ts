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
    body: unknown;
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
    json<T = unknown>(body: T): void;
    /** Sends a raw string or object payload */
    send<T = unknown>(body: T): void;
    /** A reference to the underlying native Node.js ServerResponse */
    raw: http.ServerResponse;
}
/**
 * Type alias for an agnostic route handler function.
 */
export type FerroxRouteHandler = (req: FerroxHttpRequest, res: FerroxHttpResponse) => Promise<unknown> | unknown;
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
    use(path: string, handler: unknown): void;
    /** Binds the HTTP server to a port and host */
    listen(port: number, host?: string): Promise<http.Server>;
    /** Gracefully terminates all active connections and closes the server */
    close(): Promise<void>;
}
/**
 * An adapter bridging the Ferrox-Node framework to the classic Express.js paradigm.
 * Implements a lightweight internal dispatcher if native Express isn't installed.
 */
export declare class ExpressHttpAdapter implements IFerroxHttpAdapter {
    type: HttpEngineType;
    private routes;
    private server?;
    registerRoute(route: FerroxRouteDefinition): void;
    use(_path: string, _handler: unknown): void;
    listen(port: number, host?: string): Promise<http.Server>;
    close(): Promise<void>;
}
/**
 * An adapter bridging the Ferrox-Node framework to the Fastify engine.
 * Leverages Fastify's extreme throughput and low-overhead routing natively.
 */
export declare class FastifyHttpAdapter implements IFerroxHttpAdapter {
    type: HttpEngineType;
    private routes;
    private server?;
    registerRoute(route: FerroxRouteDefinition): void;
    use(_path: string, _handler: unknown): void;
    listen(port: number, host?: string): Promise<http.Server>;
    close(): Promise<void>;
}
