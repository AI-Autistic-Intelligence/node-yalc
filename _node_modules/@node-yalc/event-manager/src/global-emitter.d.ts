import { EventEmitter2 } from 'eventemitter2';
export declare const createGlobalEventEmitter: () => EventEmitter2;
export declare const yalcStaticEventEmitter: EventEmitter2;
export declare function getYalcGlobalEventEmitter(): EventEmitter2;
export declare function setYalcGlobalEventEmitter(_eventEmitter: EventEmitter2): void;
