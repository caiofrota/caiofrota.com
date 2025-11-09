import { PostMeta } from "lib/articles";
import Link from "next/link";

type Props = {
  articles: PostMeta[];
  imagePosition?: "left" | "top";
};
export function ArticleItemList({ articles, imagePosition = "left" }: Props) {
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
            <Link href={`/blog/${article.id}`} key={article.id} className="text-slate-800 dark:text-slate-200 hover:underline">
              <p className="text-xl font-bold">{article.title}</p>
              <p className="text-sm">
                {article.date} - {article.category}
              </p>
              <p className="">{article.preview}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
