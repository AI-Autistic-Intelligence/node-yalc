/**
 * Represents an active distributed trace in W3C Trace Context format.
 */
export interface TraceContext {
    traceId: string;
    spanId: string;
    sampled: boolean;
}
/**
 * Distributed Tracing Engine.
 * Generates, parses, and formats W3C Trace Context headers (traceparent)
 * to correlate logs and requests across multiple microservices.
 */
export declare class TracingEngine {
    static createTraceContext(): TraceContext;
    static parseTraceparent(header?: string): TraceContext;
    static formatTraceparent(ctx: TraceContext): string;
}
export declare class FerroxLogger {
    private serviceName;
    constructor(serviceName?: string);
    info(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    error(message: string, meta?: Record<string, unknown>): void;
    private log;
}
