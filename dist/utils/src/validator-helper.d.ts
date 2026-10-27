export declare function stringIsInEnumOrThrow<T extends Record<string, string | number>>(toCheck: string, enumName: T, message?: string): boolean;
export declare function stringIsInEnum<T extends Record<string, string | number>>(toCheck: string, enumName: T): boolean;
export declare class ValidationError extends Error {
    readonly param: string;
    constructor(param: string, message: string);
}
/**
 * Validates integer parameters within strict allow-listed bounds.
 */
export declare function parseBoundedInt(raw: string | null | undefined, name: string, min: number, max: number): number;
export declare function parseOptionalInt(raw: string | null | undefined, name: string, min: number, max: number): number | undefined;
