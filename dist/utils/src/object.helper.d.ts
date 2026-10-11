interface IIsObject {
    (item: unknown): boolean;
}
interface IObject {
    [key: string]: unknown;
}
interface IDeepMerge {
    <T extends IObject, U extends IObject>(target: T, ...sources: Array<U>): T & U;
}
/**
 * @description Method to check if an item is an object. Date and Function are considered
 * an object, so if you need to exclude those, please update the method accordingly.
 * @param val - The item that needs to be checked
 * @return {Boolean} Whether or not @item is an object
 */
export declare const isObject: IIsObject;
/**
 * @description Method to strictly check if an item is an object. Date and Function are not considered
 * @param val - The item that needs to be checked
 * @returns
 */
export declare function isObjectStrict(val: unknown): val is Record<string, unknown>;
/**
 * @description Method to perform a deep merge of objects
 * @param isArrayConcat - Whether or not to concatenate arrays
 * @param target - The targeted object that needs to be merged with the supplied @sources
 * @param sources - The source(s) that will be used to update the @target object
 * @return The final merged object
 */
export declare const _deepMerge: (isArrayConcat: boolean, target: IObject, ...sources: Array<IObject>) => IObject;
/**
 * @description Method to perform a deep merge of objects
 * @param target - The targeted object that needs to be merged with the supplied @sources
 * @param sources - The source(s) that will be used to update the @target object
 * @returns The final merged object
 */
export declare const deepMerge: IDeepMerge;
/**
 * @description Method to perform a deep merge of objects without concatenating arrays
 * @param target - The targeted object that needs to be merged with the supplied @sources
 * @param sources - The source(s) that will be used to update the @target object
 * @returns The final merged object
 */
export declare const deepMergeWithoutArrayConcat: IDeepMerge;
/**
 * Utils to patch a nested property on an object
 * specifying a dot-separated path.
 * If the parent properties do not exist, they will be created
 *
 * @param obj the object to patch
 * @param path the path of the property to set, e.g: "foo.bar.baz"
 * @param value the value to set
 * @returns the patched object
 */
export declare function objectSetProp<T = unknown>(obj: Record<string, unknown>, path: string, value: T): Record<string, unknown>;
export declare function objectsHaveSameKeys(...objects: Record<string, unknown>[]): boolean;
/**
 * @description Method to get the object id (unique identifier) of an object
 */
export declare function getObjectId(object: Record<string, unknown> | Array<unknown>): number;
export {};
