import { BlogCard } from "components/blog-card";
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
      <Link
        href={localizedPath(current, "blog/categories")}
        className="text-sm font-bold text-cyan-700 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
      >
        ← {current === "br" ? "Categorias" : "Categories"}
      </Link>
      <h1 className="section-title mt-7">{name}</h1>
      <div className="mt-10 grid gap-5">
        {articles.map((article) => (
          <BlogCard key={article.id} article={article} locale={locale} />
        ))}
      </div>
    </main>
  );
}
