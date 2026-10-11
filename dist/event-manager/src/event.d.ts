import type { LogLevel } from '../../logger/src/logger.type.js';
import { type ImprovedLoggerService } from '../../logger/src/logger-abstract.service.js';
import { DefaultError, IErrorPayload } from '../../errors/src/default.error.js';
import { EventNameFormatter } from './emitter.js';
import { ClassType, InstanceType } from '../../types/src/index.js';
interface IEventEmitterOptions<TFormatter extends EventNameFormatter = EventNameFormatter> {
    emitter?: import('eventemitter2').EventEmitter2;
    formatter?: TFormatter;
    await?: boolean;
}
export interface IEventAliasOptions {
    eventName: string;
    await: boolean;
}
export interface IDataInfo {
    [key: string]: unknown;
    /**
     * We know that eventName is always added to the data object
     */
    eventName: string;
}
export interface IEventPayload {
    message?: string;
    /**
     * The data is the place where you want to add the extra information
     * that are not returned back as a response but they can be sent to the logger or the event emitter.
     */
    data?: IDataInfo;
    eventName: string;
    config?: any;
    level?: LogLevel;
    /**
     * This is used to log the error information.
     * NOTE: eventName and config are redundant here.
     */
    errorInfo?: IErrorPayload | null;
}
export interface IEventOptions<TFormatter extends EventNameFormatter = EventNameFormatter> {
    /**
     * The data is the place where you want to add the extra information
     * that are not returned back as a response but they can be sent to the logger or the event emitter.
     */
    data?: any;
    /**
     * This can be used to log the configuration values of the event.
     * This might be helpful to filter the logs based on extra configuration values
     * that are not the basic error level, statusCode etc.
     */
    config?: any;
    mask?: string[];
    event?: IEventEmitterOptions<TFormatter> | false;
    message?: string;
    stack?: string;
    logger?: {
        instance?: ImprovedLoggerService;
        level?: LogLevel;
    } | LogLevel | false;
    /**
     * This is used to trigger the same event with different names.
     */
    eventAliases?: (string | IEventAliasOptions)[];
}
export interface IErrorEventOptions<TFormatter extends EventNameFormatter = EventNameFormatter, TErrorClass extends DefaultError = DefaultError> extends IEventOptions<TFormatter>, Omit<IErrorPayload, 'internalMessage' | 'data' | 'cause'> {
    /**
     * If set to false or undefined, the error will not be thrown.
     * If set to true, the error will be thrown with the default error class.
     * If set to a class, the error will be thrown with the provided class.
     */
    errorClass?: ClassType<TErrorClass> | TErrorClass | boolean;
    cause?: Error;
}
export interface IErrorEventOptionsRequired<TFormatter extends EventNameFormatter = EventNameFormatter, TErrorClass extends DefaultError = DefaultError> extends Omit<IErrorEventOptions<TFormatter, TErrorClass>, 'errorClass'>, Required<Pick<IErrorEventOptions<TFormatter, TErrorClass>, 'errorClass'>> {
}
export declare function applyAwaitOption<TFormatter extends EventNameFormatter = EventNameFormatter, TOpts extends IErrorEventOptions<TFormatter> | IEventOptions<TFormatter> = IEventOptions<TFormatter>>(options?: TOpts): TOpts;
export type EventReturnType<T> = T extends {
    errorClass: false;
} ? boolean | any[] | undefined : Error | DefaultError;
type PickError<TFormatter extends EventNameFormatter = EventNameFormatter, TOpt extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>> = NonNullable<TOpt extends {
    errorClass: infer T;
} ? T extends boolean ? DefaultError : InstanceType<any> : never>;
export type eventErrorEventReturnType<TFormatter extends EventNameFormatter = EventNameFormatter, TOpt extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>> = TOpt extends {
    errorClass: false;
} ? TOpt extends {
    await: true;
} ? Promise<boolean | any[] | undefined> : boolean | any[] | undefined : TOpt extends {
    await: true;
} ? Promise<PickError<TFormatter, TOpt>> : PickError<TFormatter, TOpt>;
export type eventErrorEventReturnTypeAsync<TFormatter extends EventNameFormatter = EventNameFormatter, TOpt extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>> = Promise<TOpt extends {
    errorClass: false;
} ? boolean | any | undefined : PickError<TFormatter, TOpt>>;
export declare function isErrorOptions(options?: IEventOptions | IErrorEventOptions): options is IErrorEventOptions;
export declare function event<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> | IErrorEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): Promise<EventReturnType<TOption>> | EventReturnType<TOption>;
export declare function getLoggerOption(level: LogLevel, options?: IEventOptions): false | {
    instance?: ImprovedLoggerService;
    level: LogLevel;
};
export declare function resolveLoggerOption(logger: IEventOptions['logger']): false | {
    instance?: ImprovedLoggerService;
    level?: LogLevel;
} | undefined;
export declare function eventLogAsync<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): Promise<EventReturnType<TOption>>;
export declare function eventLog<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): EventReturnType<TOption>;
export declare function eventErrorAsync<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IErrorEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): eventErrorEventReturnTypeAsync<TFormatter, TOption>;
export declare function eventError<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IErrorEventOptions<TFormatter> = IErrorEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): eventErrorEventReturnType<TFormatter, TOption>;
export declare function eventWarnAsync<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): Promise<EventReturnType<TOption>>;
export declare function eventWarn<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): EventReturnType<TOption>;
export declare function eventDebugAsync<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): Promise<EventReturnType<TOption>>;
export declare function eventDebug<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): EventReturnType<TOption>;
export declare function eventVerboseAsync<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): Promise<EventReturnType<TOption>>;
export declare function eventVerbose<TFormatter extends EventNameFormatter = EventNameFormatter, TOption extends IEventOptions<TFormatter> = IEventOptions<TFormatter>>(eventName: Parameters<TFormatter> | string, options?: TOption): EventReturnType<TOption>;
export {};
