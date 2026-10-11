/**
 * This method can be used to convert a comma separated list of elements from process.env to an array
 * @param key
 */
export declare const envToArray: <T>(key: string) => T[];
export declare function envIsTrue(value?: string): boolean;
/**
 * Check that the current env is in production by
 * checking the explicit case first, and the implicit case after (if requested)
 * @param implicitCheck enable implicit check by default
 * @returns boolean
 */
export declare function isProduction(implicitCheck?: boolean): boolean;
