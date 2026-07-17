"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import ReactCountryFlag from "react-country-flag";

type Locale = "en" | "br";

const locales: Locale[] = ["en", "br"];

const flags: Record<Locale, string> = {
  en: "US",
  br: "BR",
};

const languageNames: Record<Locale, string> = {
  en: "English",
  br: "Português",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Record<Locale, HTMLButtonElement | null>>({ en: null, br: null });

  const segments = pathname.split("/");
  const currentLocale: Locale = segments[1] === "br" ? "br" : "en";
  const restPath = segments.length > 2 ? `/${segments.slice(2).join("/")}` : "";
  const isPortuguese = currentLocale === "br";

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const focusFrame = window.requestAnimationFrame(() => optionRefs.current[currentLocale]?.focus());

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
      if (!containerRef.current?.contains(document.activeElement)) return;

      event.preventDefault();
      const currentIndex = locales.findIndex((locale) => optionRefs.current[locale] === document.activeElement);
      let nextIndex = currentIndex;

      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = locales.length - 1;
      if (event.key === "ArrowDown") nextIndex = (Math.max(currentIndex, -1) + 1) % locales.length;
      if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + locales.length) % locales.length;

      optionRefs.current[locales[nextIndex]]?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentLocale, open]);

  function switchTo(locale: Locale) {
    setOpen(false);

    if (locale === currentLocale) {
      triggerRef.current?.focus();
      return;
    }

    document.cookie = `locale=${locale}; max-age=31536000; path=/; samesite=lax`;
    router.push(`/${locale}${restPath}`);
  }

  return (
    <div
      ref={containerRef}
      className="relative inline-block text-left"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        id={`${menuId}-trigger`}
        aria-label={isPortuguese ? "Alterar idioma" : "Change language"}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300/80 bg-white/70 px-2 py-1 text-xs font-medium text-slate-700 transition-colors duration-200 hover:bg-white motion-reduce:transition-none dark:border-slate-700/70 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:bg-slate-800 cf-ring"
      >
        <span className="text-lg leading-none" aria-hidden="true">
          <ReactCountryFlag alt="" countryCode={flags[currentLocale]} svg />
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`size-3.5 transition-transform duration-200 motion-reduce:transform-none motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            aria-labelledby={`${menuId}-trigger`}
            aria-hidden={!open}
            className="absolute left-0 z-50 mt-2 w-32 origin-top-left overflow-hidden rounded-lg border border-slate-200 bg-[#f8f7f3] p-1 text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            initial={reduceMotion ? false : { opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: reduceMotion ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{ pointerEvents: open ? "auto" : "none" }}
          >
            {locales.map((locale) => (
              <button
                key={locale}
                ref={(node) => {
                  optionRefs.current[locale] = node;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={locale === currentLocale}
                onClick={() => switchTo(locale)}
                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors duration-150 hover:bg-slate-100 focus:bg-slate-100 motion-reduce:transition-none dark:hover:bg-slate-700/70 dark:focus:bg-slate-700/70 cf-ring"
              >
                <ReactCountryFlag alt="" aria-hidden="true" countryCode={flags[locale]} svg />
                {languageNames[locale]}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
