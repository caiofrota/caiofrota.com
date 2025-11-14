"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ReactCountryFlag from "react-country-flag";

type Locale = "en" | "br";

const flags: Record<Locale, string> = {
  en: "US",
  br: "BR",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const currentLocale = (segments[1] as Locale) || "en";
  const restPath = "/" + segments.slice(2).join("/");

  const [open, setOpen] = useState(false);

  function switchTo(locale: Locale) {
    document.cookie = `locale=${locale}; max-age=31536000; path=/`;
    router.push(`/${locale}${restPath || ""}`);
    setOpen(false);
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-xs font-medium dark:border-neutral-700 dark:bg-neutral-900 cf-ring"
      >
        <span className="text-lg leading-none">
          <ReactCountryFlag countryCode={flags[currentLocale]} svg />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 mt-2 w-28 rounded-md border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900 z-50">
          <button
            onClick={() => switchTo("en")}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ReactCountryFlag countryCode={flags["en"]} svg /> English
          </button>
          <button
            onClick={() => switchTo("br")}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <ReactCountryFlag countryCode={flags["br"]} svg /> Português
          </button>
        </div>
      )}
    </div>
  );
}
