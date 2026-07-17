import { Reveal } from "components/reveal";
import { getAlternateSlug, getPublishedArticle } from "lib/blog";
import { localizedPath, oppositeLocale, routeLocale } from "lib/locale";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getPublishedArticle(locale, slug);
  if (!article) return { title: "Article not found" };
  const current = routeLocale(locale);
  const other = oppositeLocale(current);
  const otherSlug = await getAlternateSlug(article.articleId, other);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `https://www.caiofrota.com/${current}/blog/${article.slug}`,
      languages: {
        [current === "br" ? "pt-BR" : "en-US"]: `https://www.caiofrota.com/${current}/blog/${article.slug}`,
        ...(otherSlug ? { [other === "br" ? "pt-BR" : "en-US"]: `https://www.caiofrota.com/${other}/blog/${otherSlug}` } : {}),
      },
    },
    openGraph: { type: "article", title: article.title, description: article.excerpt, images: article.ogUrl ?? article.coverUrl },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = await getPublishedArticle(locale, slug);
  if (!article) notFound();
  const current = routeLocale(locale);
  const other = oppositeLocale(current);
  const otherSlug = await getAlternateSlug(article.articleId, other);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString() ?? article.publishedAt?.toISOString(),
    mainEntityOfPage: `https://www.caiofrota.com/${current}/blog/${article.slug}`,
    author: { "@type": "Person", name: "Caio Frota" },
    ...(article.coverUrl ? { image: article.coverUrl } : {}),
  };
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-16 sm:px-6">
      <Script id="article-schema" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
      <Reveal variant="fade" distance={0} duration={260}>
        <Link
          href={localizedPath(current, "blog")}
          className="text-sm font-bold text-cyan-700 transition-colors hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          ← {current === "br" ? "Voltar ao conteúdo" : "Back to writing"}
        </Link>
      </Reveal>
      <Reveal delay={50} distance={12} duration={400}>
        <header className="mt-10 border-b border-slate-200/80 pb-8 dark:border-slate-700/55">
          <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-wide text-cyan-700 dark:text-cyan-400">
            {article.category && (
              <Link href={localizedPath(current, `blog/categories/${article.category.slug}`)}>{article.category.name}</Link>
            )}
            {otherSlug && <Link href={localizedPath(other, `blog/${otherSlug}`)}>{other === "br" ? "Português" : "English"}</Link>}
          </div>
          <h1 className="mt-5 text-4xl font-black tracking-[-.045em] text-slate-900 dark:text-slate-200 md:text-5xl">{article.title}</h1>
          <p className="mt-5 text-xl leading-relaxed text-slate-600 dark:text-slate-400">{article.excerpt}</p>
        </header>
      </Reveal>
      <Reveal delay={90} distance={10} duration={440} rootMargin="0px 0px -5% 0px">
        <article
          className="article mt-8 text-slate-700 dark:text-slate-300"
          dangerouslySetInnerHTML={{ __html: article.contentHtml ?? "" }}
        />
      </Reveal>
    </main>
  );
}
