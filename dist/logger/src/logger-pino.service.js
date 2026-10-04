import pino from 'pino';
import { LoggerAbstractService, } from './logger-abstract.service.js';
import { maskDataInObject } from './logger.helper.js';
import { globalPromiseTracker } from '@node-yalc/utils';
let logger;
let destination;
export const FLUSH_INTERVAL = 10000;
export class PinoLogger extends LoggerAbstractService {
    getLogger() {
        return logger;
    }
    constructor(context, logLevels, options = {}) {
        super(context, logLevels, {
            log: (message, options) => logger.info({
                context: options?.context ?? context,
                ...maskDataInObject(options?.data, options?.masks),
                config: options?.config,
                trace: options?.stack,
            }, message),
            error: (message, trace, options) => {
                logger.error({
                    context: options?.context ?? context,
                    ...maskDataInObject(options?.data, options?.masks),
                    config: options?.config,
                    trace,
                }, message);
            },
            debug: (message, options) => logger.debug({
                context: options?.context ?? context,
                ...maskDataInObject(options?.data, options?.masks),
                config: options?.config,
                trace: options?.stack,
            }, message),
            warn: (message, options) => logger.warn({
                context: options?.context ?? context,
                ...maskDataInObject(options?.data, options?.masks),
                config: options?.config,
                trace: options?.stack,
            }, message),
            verbose: (message, options) => logger.trace({
                context: options?.context ?? context,
                ...maskDataInObject(options?.data, options?.masks),
                config: options?.config,
                trace: options?.stack,
            }, message),
        }, options);
        if (!logger) {
            destination = pino.destination({ sync: false });
            logger = pino({
                formatters: {
                    level: (label) => {
                        return { level: label };
                    },
                },
                timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
            }, destination);
        }
        logger.level = 'trace';
        setInterval(function () {
            logger.flush();
        }, FLUSH_INTERVAL).unref();
        globalPromiseTracker.addDeferred(flush);
    }
    async onApplicationShutdown() {
        await flush();
    }
}
export function flush() {
    destination?.flushSync();
    return new Promise((resolve, reject) => {
        logger.flush((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve('Logger flushed successfully');
            }
        });
    });
}
//# sourceMappingURL=logger-pino.service.js.map