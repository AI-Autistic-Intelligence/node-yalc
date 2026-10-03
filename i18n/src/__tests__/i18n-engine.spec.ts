import { I18nEngine } from '../i18n-engine';

describe('I18nEngine', () => {
  it('should initialize with default locale', () => {
    const engine = new I18nEngine();
    expect((engine as any).defaultLocale).toBe('en');
  });

  it('should register translations and append to existing locale', () => {
    const engine = new I18nEngine();
    engine.registerTranslations('en', { hello: 'Hello' });
    engine.registerTranslations('en', { world: 'World' });
    
    expect(engine.translate('hello')).toBe('Hello');
    expect(engine.translate('world')).toBe('World');
  });

  it('should translate with params and locales', () => {
    const engine = new I18nEngine('en');
    engine.registerTranslations('en', { greet: 'Hello {{ name }}' });
    engine.registerTranslations('it', { greet: 'Ciao {{name}}' });
    
    expect(engine.translate('greet', { name: 'Mario' }, 'it')).toBe('Ciao Mario');
  });

  it('should fallback to default locale if key is missing in target locale', () => {
    const engine = new I18nEngine('en');
    engine.registerTranslations('en', { welcome: 'Welcome' });
    engine.registerTranslations('it', { other: 'Altro' });
    
    expect(engine.translate('welcome', {}, 'it')).toBe('Welcome');
  });

  it('should fallback to key if completely missing', () => {
    const engine = new I18nEngine('en');
    expect(engine.translate('unknown.key')).toBe('unknown.key');
  });
});
