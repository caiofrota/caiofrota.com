"use client";
import { useQuery } from "@tanstack/react-query";
import { useTranslator } from "i18n";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  slug: string;
};
export function Article({ slug }: Props) {
  const { t, language } = useTranslator();
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", slug, language()],
    enabled: !!slug,
    queryFn: async () => {
      const response = await fetch(`/api/posts/${slug}?lang=${language()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <section className="mx-auto w-10/12 md:w-1/2 mt-20">
        <p>{"Loading..."}</p>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="mx-auto w-10/12 md:w-1/2 mt-20">
        <p>{"Post not found"}</p>
      </section>
    );
  }

  return (
    <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-10">
        <div className="flex justify-between font-poppins">
          <Link href="/blog" className="text-sm text-slate-600 dark:text-slate-400 hover:underline whitespace-nowrap">
            <ArrowLeft width={20} /> Back to Blog
          </Link>
          <span className="text-sm text-slate-600 dark:text-slate-400">{data ? data.date : ""}</span>
        </div>
        <div className="article" dangerouslySetInnerHTML={{ __html: data ? data.html : "Post not found" }} />
      </div>
    </div>
  );
}
