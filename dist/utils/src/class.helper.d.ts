import { ClassType } from '@node-yalc/types';
/**
 * Determines if a given function or object is a built-in native Class (like Error, Array, Map).
 *
 * @template T The expected class type.
 * @param {any} func The constructor function or object to inspect.
 * @param {string} [className] Optional. Ensure the class exactly matches this name.
 * @returns {boolean} True if it is a native class.
 */
export declare function isNativeClass<T = any>(func: any, className?: string): func is ClassType<T>;
/**
 * Determines if a given function is a modern ES6-style class constructor (`class MyClass {}`).
 *
 * @template T The expected class type.
 * @param {any} func The function to inspect.
 * @param {string} [className] Optional. Ensure the class exactly matches this name.
 * @returns {boolean} True if it is an ES6 class.
 */
export declare function isES6Class<T = any>(func: any, className?: string): func is ClassType<T>;
/**
 * A generalized check to determine if an object is ANY type of constructable class (Native or ES6).
 * Very useful within the Dependency Injection container to differentiate between Factory functions and Class providers.
 *
 * @template T The expected class type.
 * @param {any} func The function to inspect.
 * @param {string} [className] Optional. Ensure the class exactly matches this name.
 * @returns {boolean} True if it can be instantiated with `new`.
 */
export declare function isClass<T = any>(func: any, className?: string): func is ClassType<T>;
