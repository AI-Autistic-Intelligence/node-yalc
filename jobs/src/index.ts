export * from './stub';

export class JobsSchedulerSse {
  static scheduleJob(name: string, cron: string, fn: () => Promise<void>): void {}
}
