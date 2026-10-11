export type ObjectMapperDestPropertyType<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>, TPropertyDest extends keyof TOutputObject> = {
    transformer?: (inputObject: TInputObject, propertyName: keyof TInputObject) => TOutputObject[TPropertyDest];
    exclude?: boolean;
};
type ObjectType<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>> = {
    [index in keyof TInputObject]: Partial<{
        [K in keyof TOutputObject]: ObjectMapperDestPropertyType<TInputObject, TOutputObject, K> | boolean;
    }> | keyof TOutputObject | false;
} & Partial<{
    [index in '$transformer']: (inputObject: TInputObject, outputObject: TOutputObject) => void;
}>;
export type ObjectMapperType<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>> = ObjectType<TInputObject, TOutputObject>;
/**
 * This function allows to map 2 Objects with different properties by using
 * a bridge object (the mapper). In this way we can avoid using property decorators
 * that limit the mapping to a single destination, by allowing any mapping combinations.
 *
 */
export declare function objectMapper<TInputObject extends Record<string, any>, TOutputObject extends Record<string, any>>(inputObject: TInputObject, mapper: ObjectMapperType<TInputObject, TOutputObject>, options?: {
    copyNonMappedProperties?: boolean;
}): TOutputObject;
export {};
