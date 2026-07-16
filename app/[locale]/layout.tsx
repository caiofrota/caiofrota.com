import { Navbar } from "components/navbar";
import SchemaOrg from "components/schema";
import { ScrollToTop } from "components/scroll-to-top";
import { getDictionary, normalizeLocale } from "i18n/i18n";
import { I18nProvider } from "i18n/provider";
import { localizedPath, routeLocale } from "lib/locale";
import { SOCIAL_LINKS } from "lib/social-links";
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
    metadataBase: new URL("https://www.caiofrota.com"),
    title: {
      default: t.title,
      template: `%s | Caio Frota`,
    },
    description: t.description,
    openGraph: {
      type: "website",
      url: `https://www.caiofrota.com/${routeLocale(locale)}`,
      title: t.title,
      description: t.description,
      siteName: "Caio Frota",
      images: [{ url: "/images/caio-frota.jpg", width: 800, height: 800, alt: "Caio Frota" }],
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

  const currentLocale = routeLocale(locale);
  const navItems = [
    { label: t.menu.home, href: `/${locale}/#home` },
    { label: currentLocale === "br" ? "Cases" : "Cases", href: `/${locale}/#projects` },
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
            sameAs: SOCIAL_LINKS.map(({ url }) => url),
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
          pageTitle={t.title}
          pageDescription={t.description}
        />
        <I18nProvider translator={t} language={normalized}>
          <Providers>
            <main className="site-shell relative min-h-screen bg-site-canvas text-site-foreground selection:bg-site-accent selection:text-site-on-accent">
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
