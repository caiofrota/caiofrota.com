"use client";
import { useQuery } from "@tanstack/react-query";
import { SectionHeading } from "components/section-heading";
import { useTranslator } from "i18n";
import { PostData } from "lib/articles";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  slug: string;
};
export function Article({ slug }: Props) {
  const { t, language } = useTranslator();

  const { data, isLoading, error } = useQuery<PostData>({
    queryKey: ["post", slug, language()],
    enabled: !!slug,
    queryFn: async () => {
      const response = await fetch(`/api/posts/${slug}?lang=${language()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  function formatDate(dateStr: string) {
    return new Date(dateStr.replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")).toLocaleDateString(language(), {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (isLoading) {
    return (
      <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-6 pb-10 md:px-6 md:py-10 text-center">
          <SectionHeading title={t.blog.article.loading.title} subtitle={t.blog.article.loading.message} />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
        <div className="mx-auto max-w-6xl px-4 py-6 pb-10 md:px-6 md:py-10 text-center">
          <SectionHeading title={t.blog.article.notFound.title} subtitle={t.blog.article.notFound.message} />
          <div className="flex justify-center">
            <Link href="/blog" className="flex text-sm text-slate-600 dark:text-slate-400 hover:underline gap-2">
              <ArrowLeft width={20} />
              <span>{t.blog.article.backToBlog}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-1 md:px-6 md:py-10">
        <SectionHeading title={data.title} subtitle={data.subtitle} />
        <Link href={`/blog/categories/${data.categorySlug}`} className="flex justify-center underline text-slate-600 dark:text-slate-400">
          {data.category}
        </Link>
        <div className="flex justify-between">
          <Link href="/blog" className="flex text-sm text-slate-600 dark:text-slate-400 hover:underline gap-2">
            <ArrowLeft width={20} />
            <span>Back to Blog</span>
          </Link>
          <span className="text-sm text-slate-600 dark:text-slate-400">{data?.date ? formatDate(data.date) : ""}</span>
        </div>
        <div className="article py-4" dangerouslySetInnerHTML={{ __html: data ? data.html : "Post not found" }} />
      </div>
    </div>
  );
}
