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
        className="inline-flex items-center gap-2 rounded-lg border border-slate-300/80 bg-white/70 px-2 py-1 text-xs font-medium text-slate-700 dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-300 cf-ring"
      >
        <span className="text-lg leading-none">
          <ReactCountryFlag alt={currentLocale} countryCode={flags[currentLocale]} svg />
        </span>
      </button>

      {open && (
        <div className="absolute left-0 z-50 mt-2 w-28 rounded-md border border-slate-200 bg-[#f8f7f3] text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <button
            onClick={() => switchTo("en")}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/70"
          >
            <ReactCountryFlag alt="English" countryCode={flags["en"]} svg /> English
          </button>
          <button
            onClick={() => switchTo("br")}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700/70"
          >
            <ReactCountryFlag alt="Português" countryCode={flags["br"]} svg /> Português
          </button>
        </div>
      )}
    </div>
  );
}
