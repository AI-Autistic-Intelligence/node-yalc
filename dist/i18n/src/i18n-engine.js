/**
 * Internationalization (i18n) Engine for the Ferrox Framework.
 * Manages locale dictionaries and provides dynamic string interpolation for multi-language support.
 */
export class I18nEngine {
    /**
     * Initializes the i18n engine with a fallback locale.
     *
     * @param {string} [defaultLocale='en'] The default locale to use when a translation is missing in the requested locale.
     */
    constructor(defaultLocale = 'en') {
        this.translations = new Map();
        this.defaultLocale = defaultLocale;
    }
    /**
     * Loads a dictionary of translations into a specific locale namespace.
     *
     * @param {string} locale The locale identifier (e.g., 'en', 'it', 'fr-CA').
     * @param {Record<string, string>} dict A flat map of translation keys to template strings.
     */
    registerTranslations(locale, dict) {
        if (!this.translations.has(locale)) {
            this.translations.set(locale, new Map());
        }
        const map = this.translations.get(locale);
        for (const [k, v] of Object.entries(dict)) {
            map.set(k, v);
        }
    }
    /**
     * Retrieves and interpolates a translation string.
     * Uses double-brace syntax for variables (e.g. `Hello {{ name }}`).
     * Falls back to the `defaultLocale` if the key is missing in the requested `locale`.
     * Falls back to the raw key if missing completely.
     *
     * @param {string} key The translation key.
     * @param {Record<string, any>} [params={}] Variables to inject into the string template.
     * @param {string} [locale] The target locale. If omitted, uses the defaultLocale.
     * @returns {string} The fully interpolated string.
     */
    translate(key, params = {}, locale) {
        const targetLocale = locale || this.defaultLocale;
        let template = this.translations.get(targetLocale)?.get(key) ||
            this.translations.get(this.defaultLocale)?.get(key) ||
            key;
        for (const [paramKey, paramVal] of Object.entries(params)) {
            template = template.replace(new RegExp(`{{\\s*${paramKey}\\s*}}`, 'g'), String(paramVal));
        }
        return template;
    }
}
//# sourceMappingURL=i18n-engine.js.map