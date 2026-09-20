
export type HttpEngineType = 'express' | 'fastify';
export interface IFerroxHttpAdapter {
  use(...args: any[]): void;
  registerRoute(route: any): void;
  type: HttpEngineType;
  listen(port: number, host: string): Promise<any>;
  close(): Promise<void>;
}
export class ExpressHttpAdapter implements IFerroxHttpAdapter {
  use(...args: any[]): void {}
  registerRoute(route: any): void {}
  type: HttpEngineType = 'express';
  async listen(port: number, host: string): Promise<any> { return {}; }
  async close(): Promise<void> {}
}
export class FastifyHttpAdapter implements IFerroxHttpAdapter {
  use(...args: any[]): void {}
  registerRoute(route: any): void {}
  type: HttpEngineType = 'fastify';
  async listen(port: number, host: string): Promise<any> { return {}; }
  async close(): Promise<void> {}
}
export interface FerroxRouteDefinition {}
