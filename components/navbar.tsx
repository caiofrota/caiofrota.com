"use client";

import { AnimatePresence, motion, type Variants, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeSwitch } from "./theme-switch";

type Props = {
  navItems: { label: string; href: string }[];
  locale: string;
};

export function Navbar({ navItems, locale }: Props) {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isPortuguese = locale === "br" || locale.toLowerCase().startsWith("pt");

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    }

    function handleDesktopChange(event: MediaQueryListEvent) {
      if (event.matches) setOpen(false);
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  const backdropVariants: Variants = {
    closed: { opacity: 0, transition: { duration: reduceMotion ? 0 : 0.16 } },
    open: { opacity: 1, transition: { duration: reduceMotion ? 0 : 0.22 } },
  };

  const panelVariants: Variants = {
    closed: {
      opacity: 0,
      y: reduceMotion ? 0 : -12,
      scaleY: reduceMotion ? 1 : 0.98,
      transition: {
        duration: reduceMotion ? 0 : 0.16,
        when: "afterChildren",
        staggerChildren: reduceMotion ? 0 : 0.02,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.24,
        ease: [0.22, 1, 0.36, 1],
        when: "beforeChildren",
        delayChildren: reduceMotion ? 0 : 0.03,
        staggerChildren: reduceMotion ? 0 : 0.045,
      },
    },
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: reduceMotion ? 0 : -8 },
    open: {
      opacity: 1,
      x: 0,
      transition: { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" },
    },
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-site-border bg-site-nav backdrop-blur transition-[border-color,background-color,box-shadow] duration-300 motion-reduce:transition-none ${elevated ? "shadow-lg shadow-slate-900/10 dark:shadow-black/15" : ""}`}
    >
      <div className="relative z-50 mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href={`/${locale}/#home`} onClick={closeMenu} className="inline-flex items-center gap-2 rounded-lg cf-ring">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-cyan-700 text-xs font-black text-white transition-transform duration-200 hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none dark:bg-cyan-500 dark:text-slate-950">
            CF
          </span>
        </Link>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? (isPortuguese ? "Fechar menu" : "Close menu") : isPortuguese ? "Abrir menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((current) => !current)}
          className="theme-control relative overflow-hidden cf-ring md:hidden"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={open ? "close" : "open"}
              initial={reduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.75 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 45, scale: 0.75 }}
              transition={{ duration: reduceMotion ? 0 : 0.15 }}
              className="inline-flex"
              aria-hidden="true"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </button>

        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-site-foreground transition-colors duration-200 hover:text-site-accent motion-reduce:transition-none"
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <ThemeSwitch locale={locale} />
        </nav>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-40 cursor-default bg-slate-950/30 backdrop-blur-md md:hidden dark:bg-black/45"
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {open && (
          <motion.nav
            id={menuId}
            aria-label={isPortuguese ? "Navegação principal" : "Main navigation"}
            className="absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-3.5rem)] origin-top overflow-y-auto overscroll-contain border-t border-site-border bg-site-surface-strong px-4 py-4 shadow-2xl md:hidden"
            variants={panelVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1">
              {navItems.map((item) => (
                <motion.div key={item.href} variants={itemVariants}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-site-heading transition-colors duration-200 hover:bg-site-surface-hover motion-reduce:transition-none"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                variants={itemVariants}
                className="mt-2 flex items-center justify-between gap-3 border-t border-site-border px-3 pt-4"
              >
                <LanguageSwitcher />
                <ThemeSwitch locale={locale} />
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
