import { SocialBar } from "components/social-bar";
import { localizedPath, routeLocale } from "lib/locale";
import { SOCIAL_LINKS } from "lib/social-links";
import { siteContent } from "lib/site-content";
import { ArrowDownRight, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HomeHero({ locale }: { locale: string }) {
  const currentLocale = routeLocale(locale);
  const content = siteContent[currentLocale];

  return (
    <section id="home" className="relative isolate overflow-hidden border-b border-slate-200/80 dark:border-slate-700/50">
      <div className="site-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-18 sm:px-6 md:grid-cols-[1.25fr_.75fr] md:py-28">
        <div className="flex flex-col justify-center">
          <p className="eyebrow">{content.role}</p>
          <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[.98] tracking-[-.05em] sm:text-6xl">Caio Frota</h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-400">{content.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#projects" className="button-primary">
              {content.actions.work} <ArrowDownRight className="size-4" />
            </Link>
            <Link href={localizedPath(currentLocale, "resume")} className="button-secondary">
              {content.actions.resume} <Download className="size-4" />
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600 dark:text-slate-400">
            <SocialBar socials={SOCIAL_LINKS} showLabels />
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-sm self-center">
          <div className="absolute -inset-6 rounded-full bg-cyan-500/10 blur-3xl dark:bg-cyan-400/8" />
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/70 shadow-xl shadow-slate-900/8 dark:border-slate-700/60 dark:bg-slate-800/70 dark:shadow-black/20">
            <Image src="/images/caio-frota.jpg" alt="Caio Frota" width={800} height={800} priority className="aspect-square object-cover" />
            <p className="absolute inset-x-4 bottom-4 rounded-xl border border-white/15 bg-slate-950/75 px-4 py-3 text-sm text-slate-100 backdrop-blur">
              {content.availability}
            </p>
          </div>
        </div>
      </div>
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 border-x border-slate-200/80 dark:border-slate-700/50 sm:grid-cols-3">
        {content.proof.map((item) => (
          <div
            key={item.label}
            className="border-b border-slate-200/80 px-5 py-6 dark:border-slate-700/50 sm:border-b-0 sm:border-r last:sm:border-r-0"
          >
            <p className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-200">{item.value}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
