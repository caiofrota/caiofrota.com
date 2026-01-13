import { Navbar } from "components/navbar";
import SchemaOrg from "components/schema";
import { ScrollToTop } from "components/scroll-to-top";
import { getDictionary, normalizeLocale } from "i18n/i18n";
import { I18nProvider } from "i18n/provider";
import { Metadata } from "next";
import Script from "next/script";
import React from "react";
import { Footer } from "./_sections/footer";
import "./globals.css";
import { Providers } from "./providers";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const t = getDictionary(normalized);
  return {
    metadataBase: new URL("https://caiofrota.com"),
    title: {
      default: t.title,
      template: `%s | Caio Frota`,
    },
    description: t.description,
    openGraph: {
      type: "website",
      url: `https://caiofrota.com`,
      title: t.title,
      description: t.description,
      siteName: "Caio Frota",
      images: ["/images/caio-frota.jpg"],
    },
    alternates: {
      canonical: `https://www.caiofrota.com/${locale}`,
      languages: {
        "en-US": "https://www.caiofrota.com/en",
        "pt-BR": "https://www.caiofrota.com/br",
      },
    },
  };
}

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
      <body>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-DN01V737Z1" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DN01V737Z1');
          `}
        </Script>
        <SchemaOrg
          site={{
            url: "https://www.caiofrota.com",
            name: "Caio Frota",
            logoUrl: "https://www.caiofrota.com/images/logo-128.png",
            email: "contato@caiofrota.com",
            availableLanguages: ["pt-BR", "en-US"],
            sameAs: [
              "https://instagram.com/jcaiofrota",
              "http://facebook.com/jcaiofrota",
              "https://www.linkedin.com/in/caiofrota/",
              "https://x.com/jcaiofrota",
            ],
          }}
          config={{
            disableDefaultTypes: ["WebPage"],
          }}
        />
        <SchemaOrg
          canonicalUrl={`https://www.caiofrota.com/${locale}`}
          lang={normalized}
          alternates={[
            { url: "https://www.caiofrota.com/br/", inLanguage: "pt-BR" },
            { url: "https://www.caiofrota.com/en/", inLanguage: "en" },
          ]}
          pageTitle="Caio Frota"
          pageDescription={
            locale === "br"
              ? "Um engenheiro de software apaixonado por criar aplicações e experiências de alta qualidade."
              : "A software engineer passionate about building high-quality applications and experiences."
          }
        />
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
