import { LoggerService, LogLevel } from './logger.type.js';
import { PluginSystem } from '../../utils/src/plugin.helper.js';
export type YalcGlobalClsService = any;
/**
 * Options to modify how a log message is handled and what extra contextual data is attached to it.
 */
export interface LogMethodOptions {
    /**
     * Overrides or appends to the primary log message.
     */
    message?: any;
    /**
     * Contextual data payload.
     * Information you want to record alongside the log (e.g. user payload) without cluttering the main message.
     */
    data?: any;
    /**
     * Internal configuration object representing the current state or execution flags.
     * Useful for filtering logs based on execution context (e.g., worker ID, transaction ID).
     */
    config?: any;
    /**
     * Fields inside `data` or `config` that should be masked/obfuscated (e.g., passwords, tokens) before printing.
     */
    masks?: string[];
    /**
     * The logical context where the log originated (e.g., 'UserService', 'AuthGuard').
     */
    context?: string;
    /**
     * Error stack trace, usually automatically populated by the logger's `error` method.
     */
    stack?: string;
    /**
     * Controls event emission alongside logging.
     * - If `false`, no event is emitted.
     * - If `string`, emits an event with this specific name instead of the default name.
     */
    event?: string | false;
}
/**
 * Standard log method signature.
 */
export type LogMethod = <T>(message: T, options?: LogMethodOptions) => void;
/**
 * Standard error log method signature, explicitly including a stack trace parameter.
 */
export type LogMethodError = <T>(message: T, stack?: string, options?: LogMethodOptions) => void;
/**
 * Interface defining available plugin hooks for the logger.
 * Allows extending the logger's functionality (e.g., intercepting logs before they are written).
 */
export interface ILoggerPluginMethods<TClsService = any> extends Record<string, {
    (...args: any[]): void;
} | undefined> {
    /**
     * Hook executed immediately before a log is processed by the underlying engine.
     * @param message The original message being logged.
     * @param options The log options payload.
     * @param clsService Contextual Local Storage service for extracting request-scoped data.
     */
    onBeforeLogging?: (message: any, options: LogMethodOptions, clsService: TClsService) => void;
}
/**
 * Extended LoggerService adding plugin system capabilities and dynamic level configuration.
 */
export interface ImprovedLoggerService extends ImprovedLoggerServiceMethods, PluginSystem<ILoggerPluginMethods> {
    /**
     * Dynamically override the active log levels at runtime.
     */
    setLogLevels?(levels: LogLevel[]): void;
}
/**
 * Internal interface strictly typing the methods exposed by `ImprovedLoggerService`.
 */
export interface ImprovedLoggerServiceMethods extends LoggerService {
    log: LogMethod;
    error: LogMethodError;
    warn: LogMethod;
    debug?: LogMethod | undefined;
    verbose?: LogMethod;
}
export declare const EVENT_LOG_DEFAULT = "EVENT_LOG_DEFAULT";
/**
 * Options defining how the `LoggerAbstractService` behaves globally.
 */
export interface IImprovedLoggerOptions {
    /**
     * Global event emission configuration.
     */
    event?: {
        eventEmitter?: any | false;
        /**
         * If set to true, forces an event emission with the default name (`EVENT_LOG_DEFAULT`)
         * whenever a log is generated without an explicit event name.
         */
        useFallbackEvent?: boolean;
    } | false;
    /**
     * CLS Service instance used to inject asynchronous local context into logs (e.g. Request ID).
     */
    clsService?: YalcGlobalClsService;
    /**
     * Hard-override of standard active log levels.
     */
    overrideLoggerLevels?: LogLevel[];
}
declare const LoggerAbstractService_base: {
    new (...args: any[]): {
        [x: string]: any;
        plugins: import("../../utils/src/plugin.helper.js").Plugin<ILoggerPluginMethods<any>>[];
        registerPlugin(plugin: import("../../utils/src/plugin.helper.js").Plugin<ILoggerPluginMethods<any>>): void;
        unregisterPlugin(plugin: import("../../utils/src/plugin.helper.js").Plugin<ILoggerPluginMethods<any>>): void;
        invokePlugins(methodName: keyof ILoggerPluginMethods<any>, ...args: unknown[]): void;
    };
};
/**
 * Abstract base class for all Logger implementations in the Ferrox-Node framework.
 * Handles the common plumbing: plugin invocation, log level filtering, and event emission.
 * Subclasses only need to provide the actual I/O logic for writing strings via `this.methods`.
 */
export declare abstract class LoggerAbstractService extends LoggerAbstractService_base implements ImprovedLoggerService {
    protected context: string;
    protected logLevels: LogLevel[] | undefined;
    protected methods: ImprovedLoggerServiceMethods;
    protected options: IImprovedLoggerOptions;
    readonly isImprovedLoggerService = true;
    /**
     * Bootstraps the abstract logger.
     * Dynamically builds the runtime logging methods based on the requested log levels.
     *
     * @param context The default context string (e.g. class name) attached to logs.
     * @param logLevels The array of log levels to enable. Logs outside these levels are no-ops.
     * @param methods The actual I/O implementations provided by the subclass.
     * @param options Global logger configuration options.
     */
    constructor(context: string, logLevels: LogLevel[] | undefined, methods: ImprovedLoggerServiceMethods, options?: IImprovedLoggerOptions);
    /**
     * Modifies the active log levels and re-initializes the internal routing.
     * @param levels The new log levels array.
     */
    setLogLevels(levels: LogLevel[]): void;
    initializeLogger(): void;
    log: LogMethod;
    error: LogMethodError;
    warn: LogMethod;
    debug?: LogMethod | undefined;
    verbose?: LogMethod;
    beforeLogging<T>(message: T, options: LogMethodOptions): void;
}
export declare function beforeLogging<T>(message: T, options?: LogMethodOptions & IImprovedLoggerOptions['event']): void;
export {};
