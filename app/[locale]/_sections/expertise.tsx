import { routeLocale } from "lib/locale";
import { siteContent } from "lib/site-content";
import { Reveal } from "components/reveal";

export function Expertise({ locale }: { locale: string }) {
  const content = siteContent[routeLocale(locale)];
  return (
    <section id="about" className="scroll-mt-20 border-y border-slate-200/80 bg-white/35 dark:border-slate-700/50 dark:bg-slate-800/30">
      <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32 lg:px-10">
        <Reveal>
          <p className="eyebrow">{content.sections.expertise}</p>
          <div className="mt-5 flex max-w-4xl flex-col gap-5">
            <h2 className="section-title">{content.sections.expertise}</h2>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">{content.sections.expertiseLead}</p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {content.expertise.map((item, index) => (
            <Reveal key={item.title} index={index} stagger={75} className="h-full">
              <div className="h-full rounded-3xl border border-slate-200/80 bg-[#f8f7f3] p-7 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-cyan-600/30 hover:shadow-lg hover:shadow-slate-900/5 motion-reduce:transform-none dark:border-slate-700/60 dark:bg-slate-800/90 dark:hover:border-cyan-400/30 sm:p-8">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200">{item.title}</h3>
                <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
