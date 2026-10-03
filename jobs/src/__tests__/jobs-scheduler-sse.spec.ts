import { FerroxJobQueue, FerroxCronScheduler, FerroxSseStream } from '../jobs-scheduler-sse';
import * as http from 'http';

describe('jobs-scheduler-sse', () => {
  describe('FerroxJobQueue', () => {
    let queue: FerroxJobQueue;

    beforeEach(() => {
      queue = new FerroxJobQueue();
    });

    it('should register a worker and process a job successfully', async () => {
      const handler = jest.fn().mockResolvedValue('success');
      queue.registerWorker('testJob', handler);

      const job = queue.enqueue('testJob', { data: 'test' });
      expect(job.status).toBe('PENDING');

      // flush setImmediate
      await new Promise(setImmediate);

      expect(handler).toHaveBeenCalledWith({ data: 'test' });
      expect(job.status).toBe('COMPLETED');
    });

    it('should fail a job if handler rejects', async () => {
      const handler = jest.fn().mockRejectedValue(new Error('fail msg'));
      queue.registerWorker('testFail', handler);

      const job = queue.enqueue('testFail', { data: 'test' });
      await new Promise(setImmediate);

      expect(job.status).toBe('FAILED');
      expect(job.error).toBe('fail msg');
    });

    it('should fail a job if no handler is registered', async () => {
      const job = queue.enqueue('noHandler', {});
      await new Promise(setImmediate);

      expect(job.status).toBe('FAILED');
      expect(job.error).toContain('No worker registered for job name: noHandler');
    });

    it('should process jobs asynchronously in sequence', async () => {
      const handler = jest.fn().mockResolvedValue('success');
      queue.registerWorker('testSequence', handler);

      queue.enqueue('testSequence', 1);
      queue.enqueue('testSequence', 2);
      
      await new Promise(setImmediate);
      await new Promise(setImmediate);

      expect(handler).toHaveBeenCalledTimes(2);
    });

    it('should silently return if no pending jobs are found in processNext', async () => {
      // Access the private method to simulate an extra processNext call when queue is empty
      await (queue as any).processNext();
      expect(queue['queue'].length).toBe(0);
    });
  });

  describe('FerroxCronScheduler', () => {
    let cron: FerroxCronScheduler;

    beforeEach(() => {
      cron = new FerroxCronScheduler();
      jest.useFakeTimers();
      jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.restoreAllMocks();
    });

    it('should schedule and run a task at intervals', async () => {
      const task = jest.fn().mockResolvedValue(undefined);
      cron.scheduleTask('testCron', 1000, task);

      expect(task).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000);
      await Promise.resolve(); // wait for promise

      expect(task).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(1000);
      await Promise.resolve();
      expect(task).toHaveBeenCalledTimes(2);

      cron.stopTask('testCron');
      jest.advanceTimersByTime(1000);
      expect(task).toHaveBeenCalledTimes(2); // no longer called
    });

    it('should overwrite an existing task with the same name', () => {
      const task1 = jest.fn();
      const task2 = jest.fn();

      cron.scheduleTask('duplicate', 1000, task1);
      cron.scheduleTask('duplicate', 1000, task2);

      jest.advanceTimersByTime(1000);
      expect(task1).not.toHaveBeenCalled();
      expect(task2).toHaveBeenCalledTimes(1);
    });

    it('should handle errors in cron task gracefully', async () => {
      const task = jest.fn().mockRejectedValue(new Error('cron error'));
      cron.scheduleTask('errorCron', 1000, task);

      jest.advanceTimersByTime(1000);
      await Promise.resolve();

      expect(console.error).toHaveBeenCalledWith('Cron task [errorCron] error:', 'cron error');
    });

    it('should do nothing when stopping a non-existent task', () => {
      expect(() => {
        cron.stopTask('doesNotExist');
      }).not.toThrow();
    });
  });

  describe('FerroxSseStream', () => {
    let mockRes: Partial<http.ServerResponse>;

    beforeEach(() => {
      mockRes = {
        writeHead: jest.fn(),
        write: jest.fn(),
      };
    });

    it('should initialize SSE response headers correctly', () => {
      FerroxSseStream.initSseResponse(mockRes as http.ServerResponse);
      expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      });
    });

    it('should format and write SSE events correctly', () => {
      FerroxSseStream.sendEvent(mockRes as http.ServerResponse, 'message', { foo: 'bar' });
      expect(mockRes.write).toHaveBeenNthCalledWith(1, 'event: message\n');
      expect(mockRes.write).toHaveBeenNthCalledWith(2, 'data: {"foo":"bar"}\n\n');
    });
  });
});
