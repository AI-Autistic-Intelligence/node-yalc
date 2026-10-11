// Error message enhancement
export function checkForDuplicateKeys(keys) {
    const keySet = new Set();
    for (const key of keys) {
        if (keySet.has(key)) {
            throw new Error(`Duplicate key found in configuration: ${key}`);
        }
        keySet.add(key);
    }
}
const normalizeKeys = (keyOrKeys) => Array.isArray(keyOrKeys) ? keyOrKeys : [keyOrKeys];
export class ConfigValueManager {
    /**
     * Examples:
     *
        value(['myKey', true], false); // boolean example
        value(['myKey', 'myValue']); // string with default undefined
        value(['myKey', undefined], 'myDefaultValue'); // undefined with default string
  
        value(['myKey', 'myValue'], 'myDefaultValue'); // string example
        value(['myKey', (): string => 'myValue'], () => 'myDefaultValue'); // string example as function
    */
    static { this.value = (currentKey, configurations, defaultValue) => {
        const foundKeys = new Set();
        const normalizeReturnValue = (returnValue) => {
            if (typeof returnValue === 'function') {
                // eslint-disable-next-line @typescript-eslint/ban-types
                return returnValue(); // needed for dealing with dynamic types
            }
            return returnValue;
        };
        /**
         * Check if it's a ConfigTuple or an array of ConfigTuples
         */
        const _configurations = Array.isArray(configurations)
            ? configurations
            : [configurations];
        const allKeys = _configurations
            .map((tuple) => normalizeKeys(tuple.k))
            .flat();
        checkForDuplicateKeys(allKeys);
        for (const { k: keys, v: value } of _configurations) {
            const normalizedKeys = normalizeKeys(keys);
            normalizedKeys.forEach((key) => foundKeys.add(key));
            if (normalizedKeys.includes(currentKey)) {
                return normalizeReturnValue(value);
            }
        }
        return normalizeReturnValue(defaultValue);
    }; }
    /**
     * Examples:
     *
     * Key.is('myKey'); // true for 'myKey', and false for other keys
     */
    static { this.is = (currentKey, keys, isNegative = false) => {
        const _tuple = {
            k: normalizeKeys(keys),
            v: !isNegative,
        };
        return this.value(currentKey, _tuple, isNegative);
    }; }
    /**
     * Examples:
     *
     * Key.only('myKey', 'myValue'); // this will return 'myValue' for 'myKey', and undefined for other keys
     */
    static { this.only = (currentKey, keys, value) => {
        const _tuple = { k: normalizeKeys(keys), v: value };
        return this.value(currentKey, _tuple, undefined);
    }; }
    /**
     * Examples:
     *
     * Key.skip('myKey', 'myValue'); // this will return undefined for 'myKey', and 'myValue' for other keys
     */
    static { this.skip = (currentKey, keys, value) => {
        const _tuple = {
            k: normalizeKeys(keys),
            v: undefined,
        };
        return this.value(currentKey, _tuple, value);
    }; }
}
//# sourceMappingURL=config-manager.helper.js.map