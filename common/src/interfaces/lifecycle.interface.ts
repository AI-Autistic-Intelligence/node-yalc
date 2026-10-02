/**
 * Represents the context of the current execution request (HTTP, RPC, or WebSocket).
 * Provides utility methods to access the underlying request, response, and handler arguments.
 */
export interface IExecutionContext {
  getClass<T = any>(): T;
  getHandler(): Function;
  getArgs<T extends Array<any> = any[]>(): T;
  getArgByIndex<T = any>(index: number): T;
  switchToHttp(): any;
  switchToRpc(): any;
  switchToWs(): any;
}

/**
 * Interface for security guards that determine if a request can proceed based on custom logic (e.g., Roles, Permissions).
 */
export interface IGuard {
  /**
   * Evaluates whether the current request is authorized to execute the handler.
   */
  canActivate(context: IExecutionContext): boolean | Promise<boolean> | import('rxjs').Observable<boolean>;
}

/**
 * Interface for request/response interceptors.
 * Useful for mutating requests before they hit the handler, or mutating responses before they are sent to the client.
 */
export interface IInterceptor<R = any> {
  intercept(context: IExecutionContext, next: any): import('rxjs').Observable<R> | Promise<import('rxjs').Observable<R>>;
}

/**
 * Interface for data transformation pipelines.
 * Used to cast, validate, or sanitize input data (e.g., parsing a string to an integer).
 */
export interface IPipeTransform<T = any, R = any> {
  transform(value: T, metadata: any): R;
}

/**
 * Interface for global exception filters.
 * Catches unhandled exceptions during the request lifecycle and maps them to appropriate client responses.
 */
export interface IExceptionFilter<T = any> {
  catch(exception: T, host: any): any;
}
