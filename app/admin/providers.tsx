"use client";

import { ThemeProvider } from "next-themes";

export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableColorScheme enableSystem storageKey="theme" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
