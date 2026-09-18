import { IErrorEventOptions } from './event.js';
export declare function getLogLevelByStatus(statusCode: number): LogLevel;
export declare function getLogLevelByError(error: any): any;
export declare function isErrorEvent(options: IErrorEventOptions): boolean;
