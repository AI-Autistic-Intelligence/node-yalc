/**
 * In-memory Job Queue manager.
 * Ideal for lightweight background processing that doesn't strictly require Redis/RabbitMQ.
 * Processes jobs asynchronously via Node's event loop (`setImmediate`).
 */
export class FerroxJobQueue {
    constructor() {
        this.queue = [];
        this.handlers = new Map();
    }
    registerWorker(jobName, handler) {
        this.handlers.set(jobName, handler);
    }
    enqueue(jobName, payload) {
        const job = {
            id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: jobName,
            payload,
            status: 'PENDING',
        };
        this.queue.push(job);
        setImmediate(() => this.processNext());
        return job;
    }
    async processNext() {
        const pendingJob = this.queue.find((j) => j.status === 'PENDING');
        if (!pendingJob)
            return;
        const handler = this.handlers.get(pendingJob.name);
        if (!handler) {
            pendingJob.status = 'FAILED';
            pendingJob.error = `No worker registered for job name: ${pendingJob.name}`;
            return;
        }
        pendingJob.status = 'PROCESSING';
        try {
            await handler(pendingJob.payload);
            pendingJob.status = 'COMPLETED';
        }
        catch (err) {
            pendingJob.status = 'FAILED';
            pendingJob.error = err.message;
        }
    }
}
/**
 * In-memory Cron task scheduler.
 * Runs recurring background jobs at specified intervals.
 */
export class FerroxCronScheduler {
    constructor() {
        this.tasks = new Map();
    }
    /**
     * Registers and starts a recurring task.
     * If a task with the same name already exists, it stops the old one and overwrites it.
     *
     * @param {string} name A unique identifier for the cron task.
     * @param {number} intervalMs The execution interval in milliseconds.
     * @param {() => Promise<void> | void} task The asynchronous task to execute.
     */
    scheduleTask(name, intervalMs, task) {
        if (this.tasks.has(name)) {
            clearInterval(this.tasks.get(name));
        }
        const timer = setInterval(async () => {
            try {
                await task();
            }
            catch (err) {
                console.error(`Cron task [${name}] error:`, err.message);
            }
        }, intervalMs);
        this.tasks.set(name, timer);
    }
    stopTask(name) {
        if (this.tasks.has(name)) {
            clearInterval(this.tasks.get(name));
            this.tasks.delete(name);
        }
    }
}
/**
 * Helper class for establishing Server-Sent Events (SSE) connections.
 * SSE is ideal for streaming one-way updates (like job progress) from the server to the client.
 */
export class FerroxSseStream {
    /**
     * Configures the HTTP response to keep the connection open and stream events.
     *
     * @param {http.ServerResponse} res The raw Node.js HTTP Response object.
     */
    static initSseResponse(res) {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
            'X-Accel-Buffering': 'no',
        });
    }
    static sendEvent(res, event, data) {
        res.write(`event: ${event}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    }
}
//# sourceMappingURL=jobs-scheduler-sse.js.map