import Image from "next/image";
import Link from "next/link";
import type { PublicArticle } from "lib/blog";
import { localizedPath, routeLocale } from "lib/locale";

export function BlogCard({ article, locale }: { article: PublicArticle; locale: string }) {
  const current = routeLocale(locale);
  const date = article.publishedAt?.toLocaleDateString(current === "br" ? "pt-BR" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return (
    <article className="group grid gap-5 rounded-3xl border border-slate-200/80 bg-white/55 p-5 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-600/35 hover:bg-white/75 hover:shadow-xl hover:shadow-slate-900/5 motion-reduce:transform-none dark:border-slate-700/55 dark:bg-slate-800/35 dark:hover:border-cyan-400/35 md:grid-cols-[180px_1fr]">
      <div className="overflow-hidden rounded-2xl bg-site-surface-strong">
        {article.coverUrl ? (
          <Image
            src={article.coverUrl}
            alt=""
            width={360}
            height={220}
            className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.035] motion-reduce:transform-none motion-reduce:transition-none"
          />
        ) : (
          <div className="aspect-[16/10] h-full bg-gradient-to-br from-cyan-400/20 to-violet-400/15 transition-transform duration-500 group-hover:scale-[1.035] motion-reduce:transform-none" />
        )}
      </div>
      <div>
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-400">
          {article.category && (
            <Link href={localizedPath(current, `blog/categories/${article.category.slug}`)}>{article.category.name}</Link>
          )}
          {date && <time>{date}</time>}
        </div>
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200">
          <Link href={localizedPath(current, `blog/${article.slug}`)} className="hover:text-cyan-700 dark:hover:text-cyan-300">
            {article.title}
          </Link>
        </h2>
        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">{article.excerpt}</p>
        <Link
          href={localizedPath(current, `blog/${article.slug}`)}
          className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-cyan-700 transition-[gap,color] duration-200 hover:gap-2 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300"
        >
          {current === "br" ? "Ler artigo" : "Read article"} →
        </Link>
      </div>
    </article>
  );
}
