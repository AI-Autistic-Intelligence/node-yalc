"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleFormatter = exports.simpleDotFormatter = exports.versionedDomainActionFormatter = void 0;
exports.formatName = formatName;
exports.emitEvent = emitEvent;
exports.emitFormattedEvent = emitFormattedEvent;
const logger_1 = require("@node-yalc/logger");
const utils_1 = require("@node-yalc/utils");
function formatName(name, formatter) {
    return formatter?.(...name) ?? (Array.isArray(name) ? name.join() : name);
}
async function emitEvent(eventEmitter, name, payload, options) {
    const data = options?.mask
        ? (0, logger_1.maskDataInObject)(payload, options.mask)
        : payload;
    const _name = formatName(name, options?.formatter);
    if (!options?.await) {
        return eventEmitter.emit(_name, data);
    }
    else {
        const promise = eventEmitter.emitAsync(_name, data);
        utils_1.globalPromiseTracker.add(promise);
        return promise;
    }
}
function emitFormattedEvent(eventEmitter, name, payload, options) {
    return emitEvent(eventEmitter, [name], payload, {
        ...options,
        formatter: exports.simpleFormatter,
    });
}
const versionedDomainActionFormatter = (version, context, action, when) => {
    return `${version}.${context}.${action}.${when ?? 'onProcess'}`;
};
exports.versionedDomainActionFormatter = versionedDomainActionFormatter;
const simpleDotFormatter = (...args) => {
    return args.join('.');
};
exports.simpleDotFormatter = simpleDotFormatter;
const simpleFormatter = (action) => {
    return `on${action}`;
};
exports.simpleFormatter = simpleFormatter;
//# sourceMappingURL=emitter.js.map