import { AppLoggerFactory } from '@node-yalc/logger';
import { GetParameterCommand, SSMClient, } from '@aws-sdk/client-ssm';
export const staticKey = 'be088f8bb64166cc2938b1dd0c9db8fa223edd975f48462858a41f70ebee1c5f';
export var EncryptMode;
(function (EncryptMode) {
    EncryptMode[EncryptMode["AWS"] = 0] = "AWS";
    EncryptMode[EncryptMode["LOCAL"] = 1] = "LOCAL";
})(EncryptMode || (EncryptMode = {}));
const cachedSsmVariables = new Map();
export const decryptSsmVariable = async (toDecrypt, useCache = true) => {
    if (useCache) {
        if (cachedSsmVariables.has(toDecrypt)) {
            const cachedValue = cachedSsmVariables.get(toDecrypt);
            const value = await cachedValue;
            return value.Parameter?.Value ?? '';
        }
    }
    const ssm = new SSMClient();
    try {
        const dataPromise = ssm.send(new GetParameterCommand({
            Name: toDecrypt,
            WithDecryption: true,
        }));
        if (useCache) {
            cachedSsmVariables.set(toDecrypt, dataPromise);
        }
        const data = await dataPromise;
        return data.Parameter?.Value ?? '';
    }
    catch (err) {
        const logger = AppLoggerFactory('encryption.helper');
        logger.error(`Error while decrypting ssm variable ${toDecrypt} ${JSON.stringify(err)}`);
        return '';
    }
};
export const setEnvironmentVariablesFromSsm = async (envVariableToDecrypt, useCache = true) => {
    const ssmVars = {};
    const promises = Object.entries(envVariableToDecrypt).map(async ([envVar, ssmVar]) => {
        const value = await decryptSsmVariable(ssmVar, useCache);
        process.env[envVar] = ssmVars[envVar] = value;
    });
    await Promise.all(promises);
    return ssmVars;
};
//# sourceMappingURL=encryption.helper.js.map