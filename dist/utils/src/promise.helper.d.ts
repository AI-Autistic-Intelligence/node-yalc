import { AnyFunction } from '@node-yalc/types';
import * as pMap from 'p-map';
export declare const PROMISE_CONCURRENCY_LIMIT = 1000;
/**
 * This method allows you to run multiple async functions concurrently. It's an alternative to the Promise.all native method
 * with support to concurrency limit. It's an adapter of the p-map library.
 * NOTE: concurrency is set to 1000 by default and stopOnError = true
 *
@param input - Iterated over concurrently in the `mapper` function.
@param mapper - Function which is called for every item in `input`. Expected to return a `Promise` or value.
@returns A `Promise` that is fulfilled when all promises in `input` and ones returned from `mapper` are fulfilled, or rejects if any of the promises reject. The fulfilled value is an `Array` of the fulfilled values returned from `mapper` in `input` order.
*/
export declare function promiseMap<Element, NewElement>(input: Iterable<Element>, mapper: pMap.Mapper<Element, NewElement>, options?: pMap.Options): Promise<NewElement[]>;
/**
 * This class allows you to track multiple promises and wait for all of them to resolve.
 */
export declare class PromiseTracker {
    private promises;
    private deferred;
    add(promise: Promise<any>): void;
    /**
     * @param deferred - A function that will be executed after all promises are resolved.
     */
    addDeferred(deferred: AnyFunction): void;
    private remove;
    waitForAll(): Promise<void>;
}
/**
 * This is a global instance of the PromiseTracker class.
 */
export declare const globalPromiseTracker: PromiseTracker;
