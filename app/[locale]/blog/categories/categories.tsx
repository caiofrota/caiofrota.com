"use client";
import { SectionHeading } from "components/section-heading";
import { useTranslator } from "i18n";
import Link from "next/link";

type Props = {
  categories: { slug: string; name: string; lang: string }[];
};
export function Categories({ categories }: Props) {
  const { t, language } = useTranslator();
  const filteredCategories = categories.filter((category) => category.lang === language || !category.lang);

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
