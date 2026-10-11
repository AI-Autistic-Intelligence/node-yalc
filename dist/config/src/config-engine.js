/**
 * Centralized Configuration Engine for Ferrox-Node Framework.
 * Manages configuration retrieval with a strict hierarchy:
 * 1. Environment Variables (highest priority, dynamically parsed)
 * 2. In-memory ConfigStore
 * 3. Developer-provided fallback values
 */
export class ConfigEngine {
    /**
     * Initializes the ConfigEngine with optional default values.
     *
     * @param defaults An object containing default configuration keys and values.
     */
    constructor(defaults = {}) {
        this.configStore = new Map();
        for (const [k, v] of Object.entries(defaults)) {
            this.configStore.set(k, v);
        }
    }
    /**
     * Retrieves a configuration value.
     * Automatically parses 'true', 'false', and numeric strings from environment variables into their native types.
     *
     * @template T The expected return type of the configuration value.
     * @param {string} key The configuration key to look up.
     * @param {T} [fallback] An optional fallback value if the key is not found in ENV or the store.
     * @returns {T} The resolved configuration value.
     */
    get(key, fallback) {
        const envVal = process.env[key];
        if (envVal !== undefined) {
            if (envVal === 'true')
                return true;
            if (envVal === 'false')
                return false;
            if (!isNaN(Number(envVal)))
                return Number(envVal);
            return envVal;
        }
        if (this.configStore.has(key)) {
            return this.configStore.get(key);
        }
        return fallback;
    }
    /**
     * Manually sets or overrides a configuration value in the in-memory store.
     * Note: This does not modify `process.env`.
     *
     * @param {string} key The configuration key.
     * @param {any} value The configuration value.
     */
    set(key, value) {
        this.configStore.set(key, value);
    }
}
//# sourceMappingURL=config-engine.js.map