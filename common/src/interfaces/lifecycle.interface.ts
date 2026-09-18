export interface IExecutionContext {
  getClass<T = any>(): T;
  getHandler(): Function;
  getArgs<T extends Array<any> = any[]>(): T;
  getArgByIndex<T = any>(index: number): T;
  switchToHttp(): any;
  switchToRpc(): any;
  switchToWs(): any;
}

export interface IGuard {
  canActivate(context: IExecutionContext): boolean | Promise<boolean> | import('rxjs').Observable<boolean>;
}

export interface IInterceptor<R = any> {
  intercept(context: IExecutionContext, next: any): import('rxjs').Observable<R> | Promise<import('rxjs').Observable<R>>;
}

export interface IPipeTransform<T = any, R = any> {
  transform(value: T, metadata: any): R;
}

export interface IExceptionFilter<T = any> {
  catch(exception: T, host: any): any;
}
