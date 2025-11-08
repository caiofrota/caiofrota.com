import { useTranslator } from "i18n";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useTranslator();

  function handleChange(newLang: string) {
    changeLanguage(newLang);
    document.documentElement.lang = language();
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Languages className="h-4 w-4 opacity-70" />
      <select
        value={language()}
        onChange={(e) => handleChange(e.target.value)}
        className={`rounded-lg border px-2 py-1 text-xs font-medium cf-ring border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900`}
        aria-label="Language"
      >
        <option value="en-US">English</option>
        <option value="pt-BR">Português</option>
      </select>
    </div>
  );
}
