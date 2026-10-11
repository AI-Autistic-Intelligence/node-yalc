import { LogLevelEnum } from '../../logger/src/logger.enum.js';
import { IErrorEventOptions } from './event.js';
export declare function getLogLevelByStatus(statusCode: number): "error" | "log" | "warn";
export declare function getLogLevelByError(error: any): "error" | "log" | "warn" | LogLevelEnum.LOG | LogLevelEnum.ERROR;
/**
 * Check if the event will trigger an error log
 */
export declare function isErrorEvent(options: IErrorEventOptions): boolean;
