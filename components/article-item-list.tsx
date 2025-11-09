import { useTranslator } from "i18n";
import { PostMeta } from "lib/articles";
import Link from "next/link";

type Props = {
  articles: PostMeta[];
  imagePosition?: "left" | "top";
};
export function ArticleItemList({ articles, imagePosition = "left" }: Props) {
  const { t } = useTranslator();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5 font-poppins text-lg">
        {articles.map((article) => (
          <div
            key={article.id}
            className={`flex border-b border-neutral-200/70 pb-4 last:border-0 dark:border-neutral-800/70 gap-4 ${imagePosition === "left" ? "flex-row" : "flex-col"}`}
          >
            {article.featured && (
              <img
                src={article.featured}
                alt="Article Image"
                className={`${imagePosition === "left" ? "basis-1/3" : "max-w-full"} h-fit overflow-hidden rounded-lg shrink-0 object-cover`}
              />
            )}
            <div className="text-slate-800 dark:text-slate-200">
              <Link href={`/blog/${article.id}`} className="text-slate-800 dark:text-slate-200">
                <p className="text-xl font-bold underline">{article.title}</p>
              </Link>
              <p className="text-sm">
                {article.date} -{" "}
                <Link href={`/blog/categories/${article.categorySlug}`} className="text-slate-800 dark:text-slate-200 underline">
                  {article.category}
                </Link>
              </p>
              <p className="">{article.preview}</p>
              <Link href={`/blog/${article.id}`} className="text-slate-800 dark:text-slate-200 underline">
                {t.blog.article.readMore}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
