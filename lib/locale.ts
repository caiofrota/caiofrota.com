import { normalizeLocale, type Locale } from "i18n/i18n";

export type RouteLocale = "br" | "en";

export function routeLocale(value: string): RouteLocale {
  return normalizeLocale(value) === "pt-BR" ? "br" : "en";
}

export function contentLocale(value: string): Locale {
  return normalizeLocale(value);
}

export function localizedPath(locale: string, path = ""): string {
  const prefix = routeLocale(locale);
  const suffix = path ? `/${path.replace(/^\//, "")}` : "";
  return `/${prefix}${suffix}`;
}

export function oppositeLocale(locale: string): RouteLocale {
  return routeLocale(locale) === "br" ? "en" : "br";
}
