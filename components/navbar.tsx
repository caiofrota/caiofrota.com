"use client";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitch } from "./theme-switch";
import { useEffect, useState } from "react";
import Link from "next/link";

type Props = {
  navItems: { label: string; href: string }[];
  locale: string;
};

export function Navbar({ navItems, locale }: Props) {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const isPortuguese = locale === "br" || locale.toLowerCase().startsWith("pt");

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleClick() {
    setOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-40 border-b border-site-border bg-site-nav backdrop-blur ${elevated ? "shadow-lg shadow-slate-900/10 dark:shadow-black/15" : ""}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href={`/${locale}/#home`} onClick={handleClick} className="inline-flex items-center gap-2">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-cyan-700 text-xs font-black text-white dark:bg-cyan-500 dark:text-slate-950">
            CF
          </span>
        </Link>
        {/* Mobile: hamburger */}
        <button
          aria-label={open ? (isPortuguese ? "Fechar menu" : "Close menu") : isPortuguese ? "Abrir menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="theme-control cf-ring md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm font-medium text-site-foreground transition hover:text-site-accent">
              {n.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <ThemeSwitch locale={locale} />
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="border-t border-site-border bg-site-nav px-4 py-3 backdrop-blur md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={handleClick}
                className="rounded-xl px-3 py-2 text-sm font-medium text-site-heading transition hover:bg-site-surface-hover"
              >
                {n.label}
              </Link>
            ))}
            <div className="flex items-center justify-between gap-3 pt-2">
              <LanguageSwitcher />
              <ThemeSwitch locale={locale} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
