import { ReturnOrFunctionReturnType } from '@node-yalc/types';
export type ConfigTuple<K, T> = {
    k: K | K[];
    v: T;
};
export declare function checkForDuplicateKeys<K>(keys: K[]): void;
export declare class ConfigValueManager {
    /**
     * Examples:
     *
        value(['myKey', true], false); // boolean example
        value(['myKey', 'myValue']); // string with default undefined
        value(['myKey', undefined], 'myDefaultValue'); // undefined with default string
  
        value(['myKey', 'myValue'], 'myDefaultValue'); // string example
        value(['myKey', (): string => 'myValue'], () => 'myDefaultValue'); // string example as function
    */
    static value: <K, T, TDefault = undefined>(currentKey: K, configurations: ConfigTuple<K, T> | ConfigTuple<K, T>[], defaultValue?: TDefault) => ReturnOrFunctionReturnType<T> | ReturnOrFunctionReturnType<TDefault>;
    /**
     * Examples:
     *
     * Key.is('myKey'); // true for 'myKey', and false for other keys
     */
    static is: <K>(currentKey: K, keys: K[] | K, isNegative?: boolean) => boolean;
    /**
     * Examples:
     *
     * Key.only('myKey', 'myValue'); // this will return 'myValue' for 'myKey', and undefined for other keys
     */
    static only: <K, T>(currentKey: K, keys: K[] | K, value: T) => ReturnOrFunctionReturnType<T> | undefined;
    /**
     * Examples:
     *
     * Key.skip('myKey', 'myValue'); // this will return undefined for 'myKey', and 'myValue' for other keys
     */
    static skip: <K, T>(currentKey: K, keys: K[] | K, value: T) => ReturnOrFunctionReturnType<T> | undefined;
}
