/**
 * Internationalization (i18n) Engine for the Ferrox Framework.
 * Manages locale dictionaries and provides dynamic string interpolation for multi-language support.
 */
export declare class I18nEngine {
    private translations;
    private defaultLocale;
    /**
     * Initializes the i18n engine with a fallback locale.
     *
     * @param {string} [defaultLocale='en'] The default locale to use when a translation is missing in the requested locale.
     */
    constructor(defaultLocale?: string);
    /**
     * Loads a dictionary of translations into a specific locale namespace.
     *
     * @param {string} locale The locale identifier (e.g., 'en', 'it', 'fr-CA').
     * @param {Record<string, string>} dict A flat map of translation keys to template strings.
     */
    registerTranslations(locale: string, dict: Record<string, string>): void;
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
    translate(key: string, params?: Record<string, unknown>, locale?: string): string;
}
