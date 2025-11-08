import Link from "next/link";

export function ArticleItemList({ category, articles }: { category: string; articles: any[] }) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="font-cormorantGaramond text-4xl">{category}</h2>
      <div className="flex flex-col gap-2.5 font-poppins text-lg">
        {articles.map((article) => (
          <Link href={`/blog/${article.id}`} key={article.id} className="text-slate-800 dark:text-slate-200 hover:underline">
            {article.date} - {article.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
