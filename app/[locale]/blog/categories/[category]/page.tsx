import { BlogCard } from "components/blog-card";
import { Reveal } from "components/reveal";
import { listArticlesByCategory } from "lib/blog";
import { localizedPath, routeLocale } from "lib/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  const current = routeLocale(locale);
  const articles = await listArticlesByCategory(locale, category);
  const name = articles[0]?.category?.name ?? category;
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <Link
          href={localizedPath(current, "blog/categories")}
          className="inline-flex text-sm font-bold text-cyan-700 transition-transform duration-200 hover:-translate-x-1 hover:text-cyan-900 motion-reduce:transform-none dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          ← {current === "br" ? "Categorias" : "Categories"}
        </Link>
        <h1 className="section-title mt-7">{name}</h1>
      </Reveal>
      <div className="mt-10 grid gap-5">
        {articles.map((article, index) => (
          <Reveal key={article.id} index={index} stagger={70}>
            <BlogCard article={article} locale={locale} />
          </Reveal>
        ))}
      </div>
    </main>
  );
}
