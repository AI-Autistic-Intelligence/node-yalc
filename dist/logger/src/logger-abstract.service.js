import { LogLevelEnum } from './logger.enum.js';
// Removed event import to break circular dependency
// export type EventEmitter2 = any;
// Removed event import to break circular dependency
import { WithPluginSystem, } from '../../utils/src/plugin.helper.js';
export const EVENT_LOG_DEFAULT = 'EVENT_LOG_DEFAULT';
/**
 * Abstract base class for all Logger implementations in the Ferrox-Node framework.
 * Handles the common plumbing: plugin invocation, log level filtering, and event emission.
 * Subclasses only need to provide the actual I/O logic for writing strings via `this.methods`.
 */
export class LoggerAbstractService extends WithPluginSystem() {
    /**
     * Bootstraps the abstract logger.
     * Dynamically builds the runtime logging methods based on the requested log levels.
     *
     * @param context The default context string (e.g. class name) attached to logs.
     * @param logLevels The array of log levels to enable. Logs outside these levels are no-ops.
     * @param methods The actual I/O implementations provided by the subclass.
     * @param options Global logger configuration options.
     */
    constructor(context, logLevels, methods, 
    /* istanbul ignore next */
    options = {}) {
        super();
        this.context = context;
        this.logLevels = logLevels;
        this.methods = methods;
        this.options = options;
        this.isImprovedLoggerService = true;
        this.initializeLogger();
    }
    /**
     * Modifies the active log levels and re-initializes the internal routing.
     * @param levels The new log levels array.
     */
    setLogLevels(levels) {
        this.logLevels = levels;
        this.initializeLogger();
    }
    initializeLogger() {
        const enabledLevels = {};
        this.logLevels?.forEach((level) => {
            if (!(level.toUpperCase() in LogLevelEnum))
                throw new Error(`ERROR: Logger Level: ${level} is not supported!`);
            enabledLevels[level] = true;
        });
        this.log = (message, options = {}) => {
            void this.beforeLogging(message, options);
            (enabledLevels[LogLevelEnum.LOG] === true &&
                this.methods[LogLevelEnum.LOG]
                ? this.methods[LogLevelEnum.LOG]
                : () => { })(message, options);
        };
        this.error = (message, stack, options = {}) => {
            options.stack = stack;
            void this.beforeLogging(message, options);
            (enabledLevels[LogLevelEnum.ERROR] === true &&
                this.methods[LogLevelEnum.ERROR]
                ? this.methods[LogLevelEnum.ERROR]
                : () => { })(message, stack, options);
        };
        this.warn = (message, options = {}) => {
            void this.beforeLogging(message, options);
            (enabledLevels[LogLevelEnum.WARN] === true &&
                this.methods[LogLevelEnum.WARN]
                ? this.methods[LogLevelEnum.WARN]
                : () => { })(message, options);
        };
        if (enabledLevels[LogLevelEnum.DEBUG] === true &&
            this.methods[LogLevelEnum.DEBUG])
            this.debug = (message, options = {}) => {
                void this.beforeLogging(message, options);
                this.methods[LogLevelEnum.DEBUG](message, options);
            };
        if (enabledLevels[LogLevelEnum.VERBOSE] === true &&
            this.methods[LogLevelEnum.VERBOSE])
            this.verbose = (message, options = {}) => {
                void this.beforeLogging(message, options);
                this.methods[LogLevelEnum.VERBOSE](message, options);
            };
    }
    beforeLogging(message, options) {
        this.options.event = this.options.event ?? {};
        this.invokePlugins('onBeforeLogging', message, options, this.options.clsService);
        return beforeLogging(message, options);
    }
}
export function beforeLogging(message, 
/* istanbul ignore next */
options = {}) {
    const emitter = options && options.eventEmitter;
    if (!emitter)
        return;
    const useFallbackEvent = (options && options.useFallbackEvent) ?? false;
    const defaultEventName = useFallbackEvent ? EVENT_LOG_DEFAULT : false;
    const eventName = options.event ?? defaultEventName;
    if (!eventName)
        return;
    const { event } = require('../../event-manager/src/event.js');
    event(eventName, {
        event: { emitter },
        data: options?.data,
        config: options?.config,
        masks: options?.masks,
        message,
        logger: false,
        stack: options?.stack,
    });
}
//# sourceMappingURL=logger-abstract.service.js.map