import { EventEmitter2 } from 'eventemitter2';

let eventEmitter: import('eventemitter2').EventEmitter2;

/**
 * Creates a new instance of EventEmitter2 configured for the Ferrox framework.
 * Defaults to allowing wildcards (e.g., 'user.*') and an expanded listener limit.
 *
 * @returns {EventEmitter2} A freshly configured event emitter instance.
 */
export const createGlobalEventEmitter = () => {
  eventEmitter = new EventEmitter2({
    maxListeners: 1000,
    wildcard: true,
  });

  return eventEmitter;
};

/**
 * The static, singleton fallback event emitter used by the framework if no other
 * emitter is explicitly registered via DI or `setYalcGlobalEventEmitter`.
 */
export const yalcStaticEventEmitter = createGlobalEventEmitter();

/**
 * Retrieves the currently active global event emitter.
 * If one hasn't been set, it falls back to the `yalcStaticEventEmitter`.
 *
 * @returns {EventEmitter2} The active global event emitter instance.
 */
export function getYalcGlobalEventEmitter() {
  if (!eventEmitter) eventEmitter = yalcStaticEventEmitter;

  return eventEmitter;
}

/**
 * Do not use this function unless you know what you are doing.
 */
export function setYalcGlobalEventEmitter(_eventEmitter: import('eventemitter2').EventEmitter2) {
  eventEmitter = _eventEmitter;
}
