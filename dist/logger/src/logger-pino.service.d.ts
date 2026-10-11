import { LogLevel, OnApplicationShutdown } from './logger.type.js';
import { type Logger } from 'pino';
import { type IImprovedLoggerOptions, LoggerAbstractService } from './logger-abstract.service.js';
export declare const FLUSH_INTERVAL = 10000;
/**
 * High-performance Logger implementation using `pino` under the hood.
 * Pino is heavily optimized for speed and low overhead in production environments, writing JSON-formatted logs asynchronously.
 */
export declare class PinoLogger extends LoggerAbstractService implements OnApplicationShutdown {
    getLogger(): Logger;
    constructor(context: string, logLevels: LogLevel[], options?: IImprovedLoggerOptions);
    onApplicationShutdown(): Promise<void>;
}
/**
 * Synchronously and asynchronously flushes the Pino logger buffer.
 * We keep this function outside of the class such that we do not rely
 * on the class instance that might be destroyed before the flush is called.
 * Essential for ensuring logs are written to disk/stdout before the process exits (e.g. in AWS Lambda or graceful shutdown).
 *
 * @returns A promise that resolves when the flush operation is complete.
 */
export declare function flush(): Promise<unknown>;
