import * as http from 'http';
/**
 * Represents an asynchronous background job within the Ferrox Framework.
 */
export interface FerroxJob<T = any> {
    /** Unique auto-generated identifier for the job. */
    id: string;
    /** The routing key used to match the job to a specific worker. */
    name: string;
    /** The data payload required to process the job. */
    payload: T;
    /** Current execution status. */
    status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
    /** Populated with the error message if the status is FAILED. */
    error?: string;
}
/**
 * In-memory Job Queue manager.
 * Ideal for lightweight background processing that doesn't strictly require Redis/RabbitMQ.
 * Processes jobs asynchronously via Node's event loop (`setImmediate`).
 */
export declare class FerroxJobQueue {
    private queue;
    private handlers;
    registerWorker(jobName: string, handler: (payload: any) => Promise<any>): void;
    enqueue<T>(jobName: string, payload: T): FerroxJob<T>;
    private processNext;
}
/**
 * In-memory Cron task scheduler.
 * Runs recurring background jobs at specified intervals.
 */
export declare class FerroxCronScheduler {
    private tasks;
    /**
     * Registers and starts a recurring task.
     * If a task with the same name already exists, it stops the old one and overwrites it.
     *
     * @param {string} name A unique identifier for the cron task.
     * @param {number} intervalMs The execution interval in milliseconds.
     * @param {() => Promise<void> | void} task The asynchronous task to execute.
     */
    scheduleTask(name: string, intervalMs: number, task: () => Promise<void> | void): void;
    stopTask(name: string): void;
}
/**
 * Helper class for establishing Server-Sent Events (SSE) connections.
 * SSE is ideal for streaming one-way updates (like job progress) from the server to the client.
 */
export declare class FerroxSseStream {
    /**
     * Configures the HTTP response to keep the connection open and stream events.
     *
     * @param {http.ServerResponse} res The raw Node.js HTTP Response object.
     */
    static initSseResponse(res: http.ServerResponse): void;
    static sendEvent(res: http.ServerResponse, event: string, data: any): void;
}
