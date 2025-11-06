import { Type } from "./locales";

/**
 * An interface that provides functions to manage the i18n (internationalization) of the application.
 */
export interface II18n {
  /**
   * Returns the current language.
   */
  get language(): string;

  /**
   * Configures the i18n instance.
   *
   * @param translations Translations for the different languages.
   * @param fallbackLanguage The language that should be the language is not supported.
   */
  configure(translations: { [key: string]: Type }, fallbackLanguage: string): void;

  /**
   * Changes the language.
   *
   * @param language The language that should be used.
   */
  changeLanguage(language: string): void;

  /**
   * Returns the translation object for the current language.
   */
  get t(): Type;
}

/**
 * A class that provides functions to manage the i18n (internationalization) of the application.
 */
class I18n implements II18n {
  private readonly LOCAL_STORAGE: string = "i18n";
  private static _instance: I18n;
  private _translations: { [key: string]: Type } = {};
  private _fallbackLanguage: string = "";
  private _currentLanguage: string = "";
  private _selectedTranslation: Type = {} as Type;
  public readonly events = new EventTarget();

  private constructor() {}

  /**
   * Returns the singleton instance of the class.
   */
  static get instance(): I18n {
    if (!I18n._instance) {
      I18n._instance = new I18n();
    }
    return I18n._instance;
  }

  /**
   * Returns the language that should be used initially.
   *
   * @returns The language that should be used initially.
   */
  private getInitialLanguage(): string {
    if (typeof window === "undefined") return this._fallbackLanguage;
    const storedLanguage = localStorage.getItem(this.LOCAL_STORAGE);
    if (storedLanguage && Object.keys(this._translations).includes(storedLanguage)) {
      return storedLanguage;
    }
    const browserLanguage = navigator.language.slice(0, 2);
    if (Object.keys(this._translations).includes(browserLanguage)) {
      return browserLanguage;
    }
    return this._fallbackLanguage;
  }

  get language(): string {
    return this._currentLanguage;
  }

  configure(translations: { [key: string]: Type }, fallbackLanguage: string): void {
    this._translations = translations;
    this._fallbackLanguage = fallbackLanguage;
    this._currentLanguage = this.getInitialLanguage();
    this._selectedTranslation = translations[this._currentLanguage];
  }

  changeLanguage(language: string): void {
    if (Object.keys(this._translations).includes(language)) {
      if (typeof window !== "undefined") localStorage.setItem(this.LOCAL_STORAGE, language);
      this._currentLanguage = language;
      this._selectedTranslation = this._translations[this._currentLanguage];
      this.events.dispatchEvent(new Event("change"));
    }
  }

  proxy<T extends object>(target: T): T {
    return new Proxy(target, {
      get: (obj, prop) => {
        const value = Reflect.get(obj, prop);
        if (typeof value === "string") return value;
        if (typeof value === "object" && value !== null) {
          return this.proxy(value);
        }
        return value;
      },
    });
  }

  get t(): Type {
    return this.proxy<Type>(this._selectedTranslation);
  }
}

const i18n = I18n.instance;
export default i18n;
