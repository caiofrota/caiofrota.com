"use client";
import React from "react";
import "./globals.css";
import { Providers } from "./providers";
import i18n, { useTranslator } from "i18n";
import { Navbar } from "components/navbar";
import { Footer } from "./_sections/footer";
import { ScrollToTop } from "components/scroll-to-top";
import { en, pt_BR } from "i18n/locales";

i18n.configure(
  {
    "en-US": en,
    "pt-BR": pt_BR,
  },
  "en-US",
);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslator();

  const navItems = [
    { label: t.menu.about, href: "/#about" },
    { label: t.menu.blog, href: "/blog" },
    { label: t.menu.resume, href: "/#resume" },
    { label: t.menu.contact, href: "/#contact" },
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.description} />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>
          <main className="relative min-h-screen bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
            <Navbar navItems={navItems} />
            {children}
            <Footer />
            <ScrollToTop aboveFooter={true} />
          </main>
        </Providers>
      </body>
    </html>
  );
}
