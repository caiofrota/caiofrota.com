import { ArrowUpRight } from "lucide-react";
import { Reveal } from "components/reveal";
import { routeLocale } from "lib/locale";
import { siteContent } from "lib/site-content";

export function Portfolio({ locale }: { locale: string }) {
  const content = siteContent[routeLocale(locale)];
  return (
    <section id="projects" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-24 sm:px-8 md:py-32 lg:px-10">
      <Reveal>
        <p className="eyebrow">{content.sections.projects}</p>
        <div className="mt-5 flex max-w-4xl flex-col gap-5">
          <h2 className="section-title">{content.sections.projects}</h2>
          <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">{content.sections.projectsLead}</p>
        </div>
      </Reveal>
      <div className="mt-14 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {content.cases.map((item, index) => (
          <Reveal key={item.title} index={index} stagger={75} variant="up" className="h-full">
            <article className="group flex min-h-full flex-col rounded-3xl border border-slate-200/80 bg-white/55 p-7 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-cyan-600/35 hover:bg-white/85 hover:shadow-xl hover:shadow-slate-900/5 motion-reduce:transform-none dark:border-slate-700/55 dark:bg-slate-800/35 dark:hover:border-cyan-400/35 dark:hover:bg-slate-800/60 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-cyan-700 dark:text-cyan-400">
                  0{index + 1} · {item.eyebrow}
                </p>
                <ArrowUpRight className="size-5 text-slate-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-cyan-700 motion-reduce:transform-none dark:text-slate-500 dark:group-hover:text-cyan-300" />
              </div>
              <h3 className="mt-10 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200">{item.title}</h3>
              <p className="mt-5 leading-7 text-slate-600 dark:text-slate-400">{item.summary}</p>
              <p className="mt-6 border-l border-cyan-600/40 pl-4 text-sm leading-6 text-cyan-800 dark:border-cyan-400/40 dark:text-cyan-300">
                {item.impact}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-8">
                {item.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-300/80 px-2.5 py-1 text-xs text-slate-600 dark:border-slate-700/70 dark:text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
