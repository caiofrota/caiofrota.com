"use client";
import { createContext, useContext } from "react";
import { Type } from "./locales";

const I18nContext = createContext<I18nContext | null>(null);

type Props = {
  translator: Type;
  language: string;
  children: React.ReactNode;
};

type I18nContext = {
  t: Type;
  language: string;
};

export function I18nProvider({ translator, language, children }: Props) {
  return <I18nContext.Provider value={{ t: translator, language }}>{children}</I18nContext.Provider>;
}

export function useTranslator() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useTranslator must be used within an I18nProvider");
  }
  return context;
}
