import { SectionHeading } from "components/section-heading";
import { getDictionary, normalizeLocale } from "i18n";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const t = getDictionary(normalized);
  return {
    title: `${t.resume.title} | Caio Frota`,
    description: t.description,
    alternates: {
      canonical: `https://caiofrota.com/${locale}/resume`,
      languages: {
        en: "https://caiofrota.com/en/resume",
        pt: "https://caiofrota.com/br/resume",
      },
    },
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const normalized = normalizeLocale(locale);
  const t = getDictionary(normalized);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="border-b border-slate-300 dark:border-slate-800 pb-6">
          <SectionHeading title={t.resume.title} subtitle={t.resume.subtitle} />
          {t.resume.sections.header.descriptions.map((paragraph, index) => (
            <p key={index} className="mt-3 text-sm sm:text-base">
              {paragraph}
            </p>
          ))}
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            {t.resume.sections.header.languages.title}: {t.resume.sections.header.languages.list.join(", ")}
          </p>
        </header>

        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">{t.resume.sections.skills.title}</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">{t.resume.sections.skills.languages.title}</h3>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {t.resume.sections.skills.languages.list.map((language, index) => (
                  <li key={index}>{language}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">
                {t.resume.sections.skills.technologiesAndPlatforms.title}
              </h3>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {t.resume.sections.skills.technologiesAndPlatforms.list.map((tech, index) => (
                  <li key={index}>{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">{t.resume.sections.experience.title}</h2>

          <div className="space-y-10">
            {t.resume.sections.experience.jobs.map((job, index) => (
              <article key={index} className="relative">
                <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold">{job.company}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {job.location} - {job.period}
                      </p>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">{job.overview}</p>
                  </div>

                  <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{job.description}</p>

                  <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {t.resume.sections.skills.title}: {job.skills.join(", ")}
                  </p>

                  <div className="mt-4 space-y-4">
                    {job.positions.map((position, posIndex) => (
                      <div key={posIndex}>
                        <h4 className="text-sm font-semibold">
                          {position.title} - {position.period}
                        </h4>
                        <ul className="mt-1 list-disc list-inside text-sm text-slate-700 dark:text-slate-300 space-y-1">
                          {position.responsibilities.map((responsibility, respIndex) => (
                            <li key={respIndex}>{responsibility}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">{t.resume.sections.education.title}</h2>
          <div className="space-y-4">
            {t.resume.sections.education.institutions.map((institution, index) => (
              <div key={index} className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4">
                <h3 className="font-semibold text-sm sm:text-base">{institution.name}</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-700 dark:text-slate-300">
                  {institution.qualifications.map((degree, degIndex) => (
                    <li key={degIndex}>{degree}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold tracking-tight mb-4">{t.resume.sections.certifications.title}</h2>
          <div className="rounded-xl border border-slate-400 bg-slate-300 dark:border-slate-800 dark:bg-slate-800/40 p-4">
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
              {t.resume.sections.certifications.qualifications.map((certification, index) => (
                <li key={index}>{certification}</li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
