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
export class FerroxJobQueue {
  private queue: FerroxJob[] = [];
  private handlers: Map<string, (payload: any) => Promise<any>> = new Map();

  public registerWorker(jobName: string, handler: (payload: any) => Promise<any>): void {
    this.handlers.set(jobName, handler);
  }

  public enqueue<T>(jobName: string, payload: T): FerroxJob<T> {
    const job: FerroxJob<T> = {
      id: `job_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: jobName,
      payload,
      status: 'PENDING',
    };
    this.queue.push(job);
    setImmediate(() => this.processNext());
    return job;
  }

  private async processNext(): Promise<void> {
    const pendingJob = this.queue.find((j) => j.status === 'PENDING');
    if (!pendingJob) return;

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
    } catch (err: any) {
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
  private tasks: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Registers and starts a recurring task.
   * If a task with the same name already exists, it stops the old one and overwrites it.
   *
   * @param {string} name A unique identifier for the cron task.
   * @param {number} intervalMs The execution interval in milliseconds.
   * @param {() => Promise<void> | void} task The asynchronous task to execute.
   */
  public scheduleTask(name: string, intervalMs: number, task: () => Promise<void> | void): void {
    if (this.tasks.has(name)) {
      clearInterval(this.tasks.get(name)!);
    }

    const timer = setInterval(async () => {
      try {
        await task();
      } catch (err: any) {
        console.error(`Cron task [${name}] error:`, err.message);
      }
    }, intervalMs);

    this.tasks.set(name, timer);
  }

  public stopTask(name: string): void {
    if (this.tasks.has(name)) {
      clearInterval(this.tasks.get(name)!);
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
  public static initSseResponse(res: http.ServerResponse): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
  }

  public static sendEvent(res: http.ServerResponse, event: string, data: any): void {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}
