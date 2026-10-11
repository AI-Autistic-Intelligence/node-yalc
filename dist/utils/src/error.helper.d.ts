/**
 * If the argument of the function is an instance of Error the function throw it,
 * else it throw a new error instance
 * @throws a wrapped error, avoiding a double wrap of the error
 */
export declare function throwWrap(error: any): never;
