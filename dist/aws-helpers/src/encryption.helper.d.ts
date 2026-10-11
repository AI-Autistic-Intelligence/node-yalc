/**
 *  Used for everything locally, must still be passed since sometimes we want to use other keys
 * (think encryptionKey on for example user identity document)
 * @todo put this in a config file
 */
export declare const staticKey = "be088f8bb64166cc2938b1dd0c9db8fa223edd975f48462858a41f70ebee1c5f";
export declare enum EncryptMode {
    AWS = 0,
    LOCAL = 1
}
export declare const decryptSsmVariable: (toDecrypt: string, useCache?: boolean) => Promise<string>;
/**
 * Bulk decrypts multiple SSM parameters and dynamically injects them into `process.env`.
 * Designed for bootstrapping application configurations on startup (e.g. fetching database credentials).
 *
 * @param {Record<string, string>} envVariableToDecrypt A mapping where keys are the target `process.env` property names, and values are the SSM Parameter paths.
 * @param {boolean} [useCache=true] Uses in-memory caching to prevent duplicate lookups.
 * @returns {Promise<Record<string, string>>} A promise that resolves to an object containing the decrypted key-value pairs.
 */
export declare const setEnvironmentVariablesFromSsm: (envVariableToDecrypt: Record<string, string>, useCache?: boolean) => Promise<Record<string, string>>;
