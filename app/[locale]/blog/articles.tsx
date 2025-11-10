"use client";
import { ArticleItemList } from "components/article-item-list";
import { SectionHeading } from "components/section-heading";
import { useTranslator } from "i18n";
import { PostMeta } from "lib/articles";

export function Articles({ articles }: { articles: Record<string, PostMeta[]> }) {
  const { t, language } = useTranslator();

  return (
    <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-10 md:px-6 md:py-10">
        <SectionHeading title={t.blog.title} />
        {Object.keys(articles)
          .filter((category) => articles[category].some((article) => article.lang === language))
          .map((category) => (
            <div key={Math.random()} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2.5 font-poppins text-lg">
                <ArticleItemList
                  articles={articles[category].filter((article, index) => article.lang === language && index === 0)}
                  imagePosition="top"
                />
                <ArticleItemList articles={articles[category].filter((article, index) => article.lang === language && index > 0)} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
