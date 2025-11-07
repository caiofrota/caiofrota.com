"use client";
import i18n from "i18n";
import { en, pt_BR } from "i18n/locales";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  i18n.configure(
    {
      "en-US": en,
      "pt-BR": pt_BR,
    },
    "en-US",
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  );
}
