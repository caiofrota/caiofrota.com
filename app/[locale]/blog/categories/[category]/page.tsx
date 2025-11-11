import { ArticleItemList } from "components/article-item-list";
import { SectionHeading } from "components/section-heading";
import { getDictionary, normalizeLocale } from "i18n";
import { getCategorizedPosts } from "lib/articles";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  const lang = normalizeLocale(locale);
  const t = getDictionary(lang);

  return {
    title: `${t.blog.categories.title} - ${category}`,
    description: t.description,
    alternates: {
      canonical: `https://caiofrota.com/${locale}/blog/categories/${category}`,
      languages: {
        "en-US": `https://caiofrota.com/en/blog/categories/${category}`,
        "pt-BR": `https://caiofrota.com/br/blog/categories/${category}`,
      },
    },
  };
}

type Props = {
  params: Promise<{
    locale: string;
    category: string;
  }>;
};
export default async function BlogPage({ params }: Props) {
  const { locale, category } = await params;
  const lang = normalizeLocale(locale);
  const t = getDictionary(lang);
  const articles = await getCategorizedPosts();
  const filteredArticles = (articles[category.toLowerCase()] ?? []).filter((article) => article.lang === lang || !article.lang);

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
