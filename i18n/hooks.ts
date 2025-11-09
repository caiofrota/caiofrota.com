import { useEffect, useState } from "react";
import i18n from "./i18n";

/**
 * A hook that provides a function to change the language and a function to translate a key.
 *
 * @returns An object with the `changeLanguage` and `t` functions.
 */
export function useTranslator() {
  const [, setForceUpdate] = useState({});

  /**
   * Updates the language when the language changes.
   */
  useEffect(() => {
    function update() {
      setForceUpdate({});
    }
    setForceUpdate({});
    i18n.events.addEventListener("change", update);
    return () => {
      i18n.events.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedLanguage = localStorage.getItem("i18n");
      if (storedLanguage && storedLanguage !== i18n.language) {
        i18n.changeLanguage(storedLanguage);
      } else if (!storedLanguage) {
        const browserLang = navigator.language.startsWith("pt") ? "pt-BR" : "en-US";
        if (browserLang !== i18n.language) {
          i18n.changeLanguage(browserLang);
        }
      }
    }
  }, []);

  /**
   * Changes the language.
   *
   * @param language The language that should be used.
   */
  function changeLanguage(language: string) {
    i18n.changeLanguage(language);
    setForceUpdate({});
  }

  /**
   * Returns the current language.
   *
   * @returns The current language.
   */
  function language(): string {
    return i18n.language;
  }

  return { changeLanguage, language, t: i18n.t };
}
