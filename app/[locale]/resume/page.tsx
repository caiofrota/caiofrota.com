import { Download, ExternalLink } from "lucide-react";
import { Reveal } from "components/reveal";
import { getDictionary, normalizeLocale } from "i18n";
import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(normalizeLocale(locale));

  return {
    title: t.resume.title,
    description: t.resume.metadataDescription,
    alternates: {
      canonical: `https://www.caiofrota.com/${locale}/resume`,
      languages: {
        "en-US": "https://www.caiofrota.com/en/resume",
        "pt-BR": "https://www.caiofrota.com/br/resume",
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = getDictionary(normalizeLocale(locale));
  const experienceSections = [
    { title: t.resume.sections.experience.title, jobs: t.resume.sections.experience.jobs },
    { title: t.resume.sections.experience.additionalTitle, jobs: t.resume.sections.experience.additionalJobs },
  ];

  return (
    <div className="min-h-screen px-4 py-16 text-slate-700 dark:text-slate-300 sm:px-6 md:py-20 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        <Reveal variant="scale" distance={10} duration={520}>
          <header className="rounded-3xl border border-slate-200/80 bg-white/75 p-8 shadow-sm shadow-slate-200/50 dark:border-slate-700/60 dark:bg-slate-900/40 dark:shadow-black/10 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-cyan-700 dark:text-cyan-300">{t.resume.kicker}</p>
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl font-black tracking-[-.045em] text-slate-900 dark:text-slate-100 md:text-5xl">
                  {t.resume.subtitle}
                </h1>
                <p className="mt-3 text-xl text-cyan-700 dark:text-cyan-300">{t.resume.role}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href={`/${locale}/resume/download`} className="button-primary">
                  <Download className="size-4" />
                  {t.resume.downloadLabel}
                </Link>
                <a href="https://www.linkedin.com/in/caiofrota/" target="_blank" rel="noreferrer" className="button-secondary">
                  <ExternalLink className="size-4" />
                  LinkedIn
                </a>
              </div>
            </div>
            <div className="mt-10 grid gap-7 border-t border-slate-200/80 pt-8 dark:border-slate-700/60 md:grid-cols-3">
              {t.resume.highlights.map((highlight) => (
                <div key={highlight.label}>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{highlight.value}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{highlight.label}</p>
                </div>
              ))}
            </div>
          </header>
        </Reveal>

        <Reveal distance={14} duration={520}>
          <section className="grid gap-8 border-b border-slate-200/80 pb-16 dark:border-slate-700/60 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.resume.profileLabel}</h2>
            <div>
              {t.resume.sections.header.descriptions.map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-slate-700 dark:text-slate-300">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal distance={14} duration={520}>
          <section className="grid gap-8 border-b border-slate-200/80 pb-16 dark:border-slate-700/60 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.resume.sections.skills.title}</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {t.resume.sections.skills.groups.map((group) => (
                <div
                  key={group.title}
                  className="rounded-2xl border border-slate-200/80 bg-white/65 p-6 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-950/5 motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-700/60 dark:bg-slate-900/35 dark:hover:border-cyan-300/25 dark:hover:shadow-black/15"
                >
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-700 dark:text-cyan-300">{group.title}</h3>
                  <ul className="flex flex-wrap gap-2 text-sm text-slate-700 dark:text-slate-300">
                    {group.list.map((skill) => (
                      <li key={skill} className="rounded-full border border-slate-200/80 px-3 py-1 dark:border-slate-700/70">
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        {experienceSections.map((experienceSection, sectionIndex) => (
          <Reveal key={experienceSection.title} distance={16} duration={540}>
            <section className="grid gap-8 border-b border-slate-200/80 pb-16 dark:border-slate-700/60 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{experienceSection.title}</h2>

              <div className="space-y-12">
                {experienceSection.jobs.map((job, index) => (
                  <Reveal key={job.company} distance={12} duration={460} index={index + sectionIndex} stagger={60}>
                    <article className="relative border-l border-cyan-600/35 pl-6 dark:border-cyan-300/30">
                      <div className="absolute -left-1.5 top-1 size-3 rounded-full bg-cyan-600 dark:bg-cyan-300" />
                      <div className="rounded-2xl border border-slate-200/80 bg-white/65 p-6 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-950/5 motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-700/60 dark:bg-slate-900/35 dark:hover:border-cyan-300/25 dark:hover:shadow-black/15">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{job.company}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {job.location} - {job.period}
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {t.resume.sections.experience.skillsLabel}: {job.skills.join(", ")}
                        </p>

                        <div className="mt-4 space-y-4">
                          {job.positions.map((position) => (
                            <div key={`${position.title}-${position.period}`}>
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {position.title} - {position.period}
                              </h4>
                              <ul className="mt-2 list-disc space-y-1 pl-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                {position.responsibilities.map((responsibility) => (
                                  <li key={responsibility}>{responsibility}</li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </article>
                  </Reveal>
                ))}
              </div>
            </section>
          </Reveal>
        ))}

        <Reveal distance={14} duration={520}>
          <section className="grid gap-8 border-b border-slate-200/80 pb-16 dark:border-slate-700/60 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.resume.sections.education.title}</h2>
            <div className="space-y-4">
              {t.resume.sections.education.institutions.map((institution) => (
                <div
                  key={institution.name}
                  className="rounded-2xl border border-slate-200/80 bg-white/65 p-6 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-950/5 motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-700/60 dark:bg-slate-900/35 dark:hover:border-cyan-300/25 dark:hover:shadow-black/15"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{institution.name}</h3>
                  <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {institution.qualifications.map((degree) => (
                      <li key={degree}>{degree}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal distance={14} duration={520}>
          <section className="grid gap-8 border-b border-slate-200/80 pb-16 dark:border-slate-700/60 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.resume.sections.certifications.title}</h2>
            <div className="rounded-2xl border border-slate-200/80 bg-white/65 p-6 transition-[border-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:border-cyan-500/30 hover:shadow-md hover:shadow-cyan-950/5 motion-reduce:transform-none motion-reduce:transition-none dark:border-slate-700/60 dark:bg-slate-900/35 dark:hover:border-cyan-300/25 dark:hover:shadow-black/15">
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {t.resume.sections.certifications.qualifications.map((certification) => (
                  <li key={certification}>{certification}</li>
                ))}
              </ul>
            </div>
          </section>
        </Reveal>

        <Reveal distance={14} duration={520}>
          <section className="grid gap-8 pb-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t.resume.sections.languages.title}</h2>
            <p className="leading-relaxed text-slate-700 dark:text-slate-300">{t.resume.sections.languages.list.join(", ")}</p>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
