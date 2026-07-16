"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type Props = {
  locale: string;
};

const switchClassName = "theme-control min-w-[5.75rem] justify-center cf-ring";

export function ThemeSwitch({ locale }: Props) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();
  const isPortuguese = locale === "br" || locale.toLowerCase().startsWith("pt");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) {
    return (
      <span className={switchClassName} aria-hidden="true">
        <span className="size-4" />
        <span className="h-3 w-8 rounded-full bg-slate-400/20" />
      </span>
    );
  }

  const isDark = resolvedTheme === "dark";
  const visibleLabel = isDark ? (isPortuguese ? "Escuro" : "Dark") : isPortuguese ? "Claro" : "Light";
  const actionLabel = isDark
    ? isPortuguese
      ? "Ativar tema claro"
      : "Switch to light theme"
    : isPortuguese
      ? "Ativar tema escuro"
      : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={switchClassName}
      aria-label={actionLabel}
      title={actionLabel}
    >
      {isDark ? <Moon className="size-4" aria-hidden="true" /> : <Sun className="size-4" aria-hidden="true" />}
      <span>{visibleLabel}</span>
    </button>
  );
}
