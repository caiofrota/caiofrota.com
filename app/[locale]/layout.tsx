import { Navbar } from "components/navbar";
import { ScrollToTop } from "components/scroll-to-top";
import { getDictionary, normalizeLocale } from "i18n/i18n";
import { I18nProvider } from "i18n/provider";
import React from "react";
import { Footer } from "./_sections/footer";
import "./globals.css";
import { Providers } from "./providers";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const t = getDictionary(normalized);
  return {
    title: t.title,
    description: t.description,
    openGraph: {
      title: t.title,
      url: `https://caiofrota.com/${locale}`,
      description: t.description,
      type: "website",
      images: ["/images/caio-frota.jpg"],
    },
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

type Props = {
  params: Promise<{ locale: string }>;
  children: React.ReactNode;
};
export default async function RootLayout({ params, children }: Props) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const t = getDictionary(normalized);

  const navItems = [
    { label: t.menu.home, href: `/${locale}/#home` },
    { label: t.menu.about, href: `/${locale}/#about` },
    { label: t.menu.blog, href: `/${locale}/blog` },
    { label: t.menu.resume, href: `/${locale}/resume` },
    { label: t.menu.contact, href: `/${locale}/#contact` },
  ];

  return (
    <html lang={normalized} suppressHydrationWarning>
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
        <I18nProvider translator={t} language={normalized}>
          <Providers>
            <main className="relative min-h-screen bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
              <Navbar navItems={navItems} locale={locale} />
              {children}
              <Footer />
              <ScrollToTop aboveFooter={true} />
            </main>
          </Providers>
        </I18nProvider>
      </body>
    </html>
  );
}
