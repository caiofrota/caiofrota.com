"use client";
import { Card } from "components/card";
import { Pill } from "components/pill";
import { motion } from "framer-motion";
import { useTranslator } from "i18n";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  const { t, language, changeLanguage } = useTranslator();

  return (
    <section id="home" className="relative mx-auto min-h-[calc(100vh-58px)] max-w-6xl px-4 pb-16 pt-12 md:px-6 md:pb-20 md:pt-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl"
            onClick={() => changeLanguage(language() === "en" ? "pt" : "en")}
          >
            Caio Frota
            <br className="hidden sm:block" /> {}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.07 }}
            className="mt-4 max-w-xl text-base text-neutral-800 dark:text-neutral-300 md:text-lg gap-2"
          >
            <p className="justify-center md:justify-start">{t.hero.brief}</p>
            <p className="italic pt-2 text-sm text-slate-500 justify-center md:justify-start">{t.hero.subtitle}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`group inline-flex items-center gap-2 rounded-xl bg-linear-to-r cf-accent px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-transform active:scale-[.98]`}
            >
              {t.hero.cta.primary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 backdrop-blur transition hover:bg-white dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
            >
              {t.hero.cta.secondary}
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-8 flex items-center gap-4"
          >
            {/*socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
              >
                <s.icon className="h-4 w-4" /> {I18N.en.socials[s.key as keyof typeof I18N.en.socials]}
              </a>
            ))*/}
          </motion.div>
        </div>

        {/* Hero visual */}
        <div className="relative">
          <Card className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden p-0">
            <Image
              src="/images/caio-frota.jpg"
              alt="Caio Frota — portrait / creation"
              fill
              sizes="(max-width: 768px) 80vw, 400px"
              className="object-cover"
              priority
            />

            <div className="absolute left-1/2 -translate-x-1/2 bottom-2 line">
              <Pill>
                <span className="whitespace-nowrap">{t.hero.me.availability}</span>
              </Pill>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
