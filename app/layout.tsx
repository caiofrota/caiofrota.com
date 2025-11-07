"use client";

import React from "react";
import "./globals.css";
import { Providers } from "./providers";
import { useTranslator } from "i18n";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslator();

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
