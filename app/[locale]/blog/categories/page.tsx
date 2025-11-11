import { SectionHeading } from "components/section-heading";
import { getDictionary, normalizeLocale } from "i18n";
import { getCategorizedPosts } from "lib/articles";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = normalizeLocale(locale);
  const t = getDictionary(lang);

  return {
    title: `${t.blog.categories.title}`,
    description: t.description,
    alternates: {
      canonical: `https://www.caiofrota.com/${locale}/blog/categories`,
      languages: {
        "en-US": `https://www.caiofrota.com/en/blog/categories`,
        "pt-BR": `https://www.caiofrota.com/br/blog/categories`,
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
  const filteredCategories = Object.keys(articles ?? {})
    .map((category) => ({
      slug: category,
      name: `${articles[category]?.[0]?.category} (${articles[category].length})`,
      lang: articles[category]?.[0]?.lang ?? "",
    }))
    .filter((category) => category.lang === lang || !category.lang);

  return (
    <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-10 md:px-6 md:py-10">
        <SectionHeading title={t.blog.categories.title} />
        {filteredCategories.map((category) => (
          <Link
            href={`/blog/categories/${category.slug}`}
            key={category.name}
            className="text-center text-lg font-poppins text-slate-800 dark:text-slate-200"
          >
            <p>{category.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
