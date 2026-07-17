import { BlogCard } from "components/blog-card";
import { Reveal } from "components/reveal";
import { listPublishedArticles } from "lib/blog";
import { routeLocale } from "lib/locale";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const current = routeLocale(locale);
  const isPt = current === "br";
  return {
    title: isPt ? "Conteúdo técnico" : "Technical writing",
    description: isPt
      ? "Artigos de Caio Frota sobre arquitetura de software, backend, cloud e liderança técnica."
      : "Articles by Caio Frota on software architecture, backend, cloud, and technical leadership.",
    alternates: {
      canonical: `https://www.caiofrota.com/${current}/blog`,
      languages: {
        "pt-BR": "https://www.caiofrota.com/br/blog",
        "en-US": "https://www.caiofrota.com/en/blog",
      },
    },
  };
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const articles = await listPublishedArticles(locale);
  const isPt = routeLocale(locale) === "br";
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <p className="eyebrow">{isPt ? "Ideias em construção" : "Ideas in progress"}</p>
        <h1 className="section-title mt-4 text-slate-900 dark:text-slate-100">{isPt ? "Conteúdo técnico" : "Technical writing"}</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          {isPt
            ? "Arquitetura de software, backend, cloud e decisões práticas de engenharia."
            : "Software architecture, backend, cloud, and practical engineering decisions."}
        </p>
      </Reveal>
      <div className="mt-10 grid gap-5">
        {articles.length ? (
          articles.map((article, index) => (
            <Reveal key={article.id} index={index} stagger={70} distance={16}>
              <BlogCard article={article} locale={locale} />
            </Reveal>
          ))
        ) : (
          <Reveal>
            <p className="rounded-2xl border border-slate-200 p-6 text-slate-600 dark:border-white/10 dark:text-slate-300">
              {isPt ? "Os próximos artigos estão sendo preparados." : "New articles are being prepared."}
            </p>
          </Reveal>
        )}
      </div>
    </main>
  );
}
