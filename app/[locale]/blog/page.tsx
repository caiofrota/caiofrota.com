import { ArticleItemList } from "components/article-item-list";
import { SectionHeading } from "components/section-heading";
import { getDictionary, normalizeLocale } from "i18n";
import { getCategorizedPosts } from "lib/articles";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = normalizeLocale(locale);
  const t = getDictionary(lang);

  return {
    title: t.blog.title,
    description: t.description,
    alternates: {
      canonical: `https://www.caiofrota.com/${locale}/blog`,
      languages: {
        "en-US": `https://www.caiofrota.com/en/blog`,
        "pt-BR": `https://www.caiofrota.com/br/blog`,
      },
    },
  };
}

type Props = {
  params: Promise<{ locale: string }>;
};
export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const lang = normalizeLocale(locale);
  const t = getDictionary(lang);
  const articles = await getCategorizedPosts();

  return (
    <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-10 md:px-6 md:py-10">
        <SectionHeading title={t.blog.title} />
        {Object.keys(articles)
          .filter((category) => articles[category].some((article) => article.lang === lang))
          .map((category) => (
            <div key={Math.random()} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2.5 font-poppins text-lg">
                <ArticleItemList
                  articles={articles[category].filter((article, index) => article.lang === lang && index === 0)}
                  imagePosition="top"
                />
                <ArticleItemList articles={articles[category].filter((article, index) => article.lang === lang && index > 0)} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
