import { listPublishedCategories } from "lib/blog";
import { localizedPath, routeLocale } from "lib/locale";
import Link from "next/link";
import { Reveal } from "components/reveal";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const current = routeLocale(locale);
  const categories = await listPublishedCategories(locale);
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-16 sm:px-6">
      <Reveal>
        <p className="eyebrow">{current === "br" ? "Navegação" : "Browse"}</p>
        <h1 className="section-title mt-4">{current === "br" ? "Categorias" : "Categories"}</h1>
      </Reveal>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {categories.map((category, index) => (
          <Reveal key={category.slug} index={index} stagger={60} className="h-full">
            <Link
              href={localizedPath(current, `blog/categories/${category.slug}`)}
              className="group flex h-full items-center justify-between rounded-2xl border border-slate-200/80 bg-white/55 p-5 text-lg font-semibold text-slate-900 transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-cyan-600/35 hover:bg-white/80 hover:shadow-lg motion-reduce:transform-none dark:border-slate-700/55 dark:bg-slate-800/35 dark:text-slate-200 dark:hover:border-cyan-400/35"
            >
              <span>{category.name}</span>
              <span className="text-sm font-normal text-slate-600 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-slate-400">
                {category.count}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
