"use client";
import { Menu, X } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitch } from "./theme-switch";
import { useEffect, useState } from "react";

type Props = {
  navItems: { label: string; href: string }[];
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
};

export function Navbar({ navItems, onNavClick }: Props) {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onNavClick(e, href);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 ${elevated ? "border-b shadow-sm" : "border-b"} border-neutral-200/60 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-neutral-800/60 dark:bg-black/40 dark:supports-backdrop-filter:bg-black/30`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <a href="#home" className="inline-flex items-center gap-2" onClick={(e) => onNavClick(e as any, "#home") as any}>
          <span className="font-semibold tracking-tight">CF</span>
        </a>
        {/* Mobile: hamburger */}
        <button
          aria-label={open ? "Close" : "Open"}
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition cf-ring border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800`}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => onNavClick(e, n.href)}
              className="text-sm font-medium text-neutral-800 transition hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white"
            >
              {n.label}
            </a>
          ))}
          <LanguageSwitcher />
          <ThemeSwitch />
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-neutral-200/60 bg-white/95 px-4 py-3 dark:border-neutral-800/60 dark:bg-neutral-950/95">
          <div className="flex flex-col gap-3">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => handleClick(e, n.href)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                {n.label}
              </a>
            ))}
            <div className="flex items-center justify-between gap-3 pt-2">
              <LanguageSwitcher />
              <ThemeSwitch />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
