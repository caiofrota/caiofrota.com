"use client";
import { useTranslator } from "i18n";
import { ArticleItemList } from "components/article-item-list";
import { SectionHeading } from "components/section-heading";
import { motion } from "framer-motion";
import { PostMeta } from "lib/articles";

export function Articles({ articles }: { articles: Record<string, PostMeta[]> }) {
  const { t, language } = useTranslator();

  const a = (
    <section id="about" className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <SectionHeading kicker={t.about.kicker} title={t.about.title} subtitle={t.about.subtitle} />
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.07 }}
          className="flex flex-col text-base text-neutral-800 dark:text-neutral-300 md:text-lg gap-4"
        >
          <p className="justify-center md:justify-start">{t.about.text.p1}</p>
          <p className="justify-center md:justify-start">{t.about.text.p2}</p>
          <p className="justify-center md:justify-start">{t.about.text.p3}</p>
          <p className="justify-center md:justify-start">{t.about.text.p4}</p>
          <p className="justify-center md:justify-start">{t.about.text.p5}</p>
        </motion.div>
      </div>
    </section>
  );
  return (
    <div className="scroll-mt-[58px] w-full bg-slate-100 dark:bg-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-6 pb-10 md:px-6 md:py-10">
        <SectionHeading title="Blog" />
        {Object.keys(articles)
          .filter((category) => articles[category].some((article) => article.lang === language()))
          .map((category) => (
            <div key={Math.random()} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2.5 font-poppins text-lg">
                <ArticleItemList
                  articles={articles[category].filter((article, index) => article.lang === language() && index === 0)}
                  imagePosition="top"
                />
                <ArticleItemList articles={articles[category].filter((article, index) => article.lang === language() && index > 0)} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
