"use client";

import { Navbar } from "components/navbar";
import { useTranslator } from "i18n";
import { useCallback } from "react";
import { Hero } from "./hero";

export default function Layout() {
  const { t } = useTranslator();

  const navItems = [
    { label: t.menu.about, href: "#about" },
    { label: t.menu.blog, href: "#blog" },
    { label: t.menu.resume, href: "#resume" },
    { label: t.menu.contact, href: "#contact" },
  ];

  const onNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <div>
      <main className="relative min-h-screen overflow-hidden bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <Navbar navItems={navItems} onNavClick={onNavClick} />
        <Hero />
      </main>
    </div>
  );
}
