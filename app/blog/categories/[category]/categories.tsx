"use client";
import { ArticleItemList } from "components/article-item-list";
import { SectionHeading } from "components/section-heading";
import { useTranslator } from "i18n";
import { PostMeta } from "lib/articles";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  articles: PostMeta[];
};
export function Categories({ articles }: Props) {
  const { t, language } = useTranslator();
  const filteredArticles = articles.filter((article) => article.lang === language() || !article.lang);

  return (
    <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-10 md:px-6 md:py-10">
        {filteredArticles.length > 0 ? (
          <>
            <SectionHeading title={t.blog.categories.title} subtitle={filteredArticles[0].category} />
            <Link href="/blog" className="flex text-sm justify-center text-slate-600 dark:text-slate-400 hover:underline gap-2">
              <ArrowLeft width={20} />
              <span>{t.blog.article.backToBlog}</span>
            </Link>
            <div className="flex flex-col gap-2.5 font-poppins text-lg pt-4">
              <ArticleItemList articles={filteredArticles.filter((_, index) => index === 0)} imagePosition="top" />
              <ArticleItemList articles={filteredArticles.filter((_, index) => index > 0)} />
            </div>
          </>
        ) : (
          <SectionHeading title={t.blog.categories.notFound.title} subtitle={t.blog.categories.notFound.message} />
        )}
      </div>
    </div>
  );
}
