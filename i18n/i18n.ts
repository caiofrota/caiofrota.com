import { en, pt_BR, Type } from "./locales";

export type Locale = "en-US" | "pt-BR";

const translations: Record<Locale, Type> = {
  "en-US": en,
  "pt-BR": pt_BR,
};

export function normalizeLocale(raw?: string | null): Locale {
  if (!raw) return "en-US";
  const lower = raw.toLowerCase();
  const first = lower.slice(0, 2);
  if (["pt", "br"].includes(first)) return "pt-BR";
  return "en-US";
}

export function getDictionary(localeOrHeader?: string | null): Type {
  const locale = normalizeLocale(localeOrHeader);
  return translations[locale];
}
