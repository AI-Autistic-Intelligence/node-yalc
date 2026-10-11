import { AnyFunction } from '@node-yalc/types';
import { MonoTypeOperatorFunction, ObservableInput, Observable, UnaryFunction } from 'rxjs';
/**
 * Wraps any value into an observable.
 *
 * - If the input is an Observable, the input is returned directly.
 * - If the input is a Promise, it is converted to an Observable.
 * - If the input is `null` or `undefined` an empty Observable is returned.
 * - Otherwise the input is simply wrapped into an Observable.
 *
 * @param input Input which will be wrapped into an Observable.
 * @returns Observable which wraps the input.
 */
export declare function wrapIntoObservable<T>(input: Promise<T> | {
    (): Promise<T>;
} | Observable<T> | T | void): Observable<T>;
export declare function wrapIntoAnOperator(input: AnyFunction): UnaryFunction<any, any>;
/**
 * Behaves exactly like `switchMap`, except that it maps all values back to the initial value.
 * @param project Projection function which returns the inner observable.
 */
export declare function switchTap<T, O extends ObservableInput<any>>(project: (value: T, index: number) => O): MonoTypeOperatorFunction<T>;
