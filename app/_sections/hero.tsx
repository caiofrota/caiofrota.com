"use client";
import { Card } from "components/card";
import { Pill } from "components/pill";
import { SocialBar } from "components/social-bar";
import { motion } from "framer-motion";
import { useTranslator } from "i18n";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Hero() {
  const { t, language, changeLanguage } = useTranslator();

  return (
    <section id="home" className="scroll-mt-[58px] relative mx-auto max-w-6xl px-4 pb-16 pt-12 md:px-6 md:pb-20 md:pt-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold leading-tight tracking-tight text-center md:text-left md:text-6xl"
            onClick={() => changeLanguage(language() === "en" ? "pt" : "en")}
          >
            Caio Frota
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.07 }}
            className="mt-4 max-w-xl text-base text-neutral-800 dark:text-neutral-300 text-center md:text-left md:text-lg gap-2"
          >
            <p className="justify-center md:justify-start">{t.hero.brief}</p>
            <p className="italic pt-2 text-sm text-slate-500 justify-center md:justify-start">{t.hero.subtitle}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 flex flex-wrap items-center justify-center md:justify-normal gap-3"
          >
            <Link
              href="https://github.com/caiofrota"
              target="_blank"
              rel="noreferrer"
              className={`group inline-flex items-center gap-2 rounded-xl bg-linear-to-r cf-accent px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-transform active:scale-[.98]`}
            >
              {t.hero.cta.primary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#contact"
              className="rounded-xl border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 backdrop-blur transition hover:bg-white dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-900"
            >
              {t.hero.cta.secondary}
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-8 flex items-center justify-center md:justify-normal gap-4"
          >
            <SocialBar
              socials={[
                { type: "github", url: "https://github.com/caiofrota" },
                { type: "instagram", url: "https://instagram.com/jcaiofrota" },
                { type: "linkedin", url: "https://www.linkedin.com/in/caiofrota/" },
              ]}
              showLabels={true}
            />
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
