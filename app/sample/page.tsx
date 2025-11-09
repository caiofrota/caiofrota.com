"use client";

import React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Cpu,
  Code2,
  PenTool,
  Globe,
  Heart,
  Music,
  Sparkles,
  Moon,
  Sun,
  Languages,
  Menu,
  X,
  ChevronUp,
} from "lucide-react";
import Link from "next/link";

/**
 * CaioFrota.com — Next.js Home (App Router)
 * Now with: dark-first layout enforced, smooth in-page scroll, scroll-to-top,
 * mobile-first sticky header + hamburger menu.
 */

// ——————————————————————————————————————————
// Accent & Design Tokens
// ——————————————————————————————————————————
const TOKENS = {
  accent: "from-[#253160] via-[#4f4c9a] to-[#318ac7] dark:from-[#0098ac] dark:via-[#318ac7] dark:to-[#4f4c9a]",
  ring: "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 focus:ring-offset-white dark:focus:ring-offset-black",
  card: "rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-800/5 dark:border-neutral-800 dark:bg-neutral-900",
  pill: "inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold text-white",
};

// ——————————————————————————————————————————
// i18n (JSON-like dictionary). EN default; auto-detect browser.
// ——————————————————————————————————————————
const I18N = {
  en: {
    brand: "Caio Frota",
    nav: { about: "About", projects: "Projects", content: "Content", contact: "Contact" },
    hero: {
      title1: "Software Engineer &",
      title2: "Maker of Useful Things",
      subtitle:
        "Integrations with Node.js, Next.js and automations that connect systems and people. Code with purpose, aesthetics and real reliability.",
      ctaPrimary: "See projects",
      ctaSecondary: "Contact me",
      availability: "Open to collaborations",
      badge: "Full-stack with an Integrations focus",
    },
    about: {
      kicker: "Who am I",
      title: "Simple solutions for complex problems",
      subtitle: "Senior Software Engineer, Tech Lead and creator of experiences that blend code, design and real impact.",
      cards: [
        {
          title: "Integrations & Architecture",
          text: "Resilient pipelines, automated tests, contract versioning and observability that prevents 3AM firefights.",
        },
        {
          title: "Product & UX",
          text: "Light, human interfaces with subtle motion and focus on clarity. Form serves function — and delights.",
        },
        {
          title: "Content & Community",
          text: "I share learnings with honesty and humor, bridging beginners and experts.",
        },
      ],
    },
    portfolio: {
      kicker: "Selected portfolio",
      title: "Recent projects & bets",
      subtitle: "From critical integrations to creative experiences. Highlights:",
      inProgress: "In progress",
    },
    pillars: {
      kicker: "For the community",
      title: "Content I like to produce",
      subtitle: "Practical education, light humor and careful aesthetics.",
      items: [
        { title: "Software Engineering", blurb: "Practical backend tips, robust integrations and patterns that scale." },
        { title: "Automation & IoT", blurb: "Hands-on projects with ESP32/8266, voice, sensors and dashboards." },
        { title: "Creation & Personal Brand", blurb: "Reels, scripts and technical storytelling with humor and purpose." },
      ],
    },
    cta: {
      title: "1:1 Mentoring",
      blurb: "Support for devs starting out or transitioning to integrations and architecture.",
      button: "Book a chat",
    },
    contact: {
      kicker: "Shall we build?",
      title: "Contact",
      subtitle: "Partnerships, quick consulting, complex integrations — or just say hi.",
    },
    form: {
      name: "Your name",
      email: "Email",
      message: "Message",
      placeholderName: "How should I call you?",
      placeholderEmail: "you@email.com",
      placeholderMsg: "Tell me about your challenge…",
      send: "Send",
      demo: "*Demo form. Hook to your API or email service.",
    },
    footer: { madeWith: (year: number) => `© ${year} Caio Frota. Built with care & TypeScript.` },
    socials: { github: "GitHub", linkedin: "LinkedIn", email: "Email" },
    menu: { open: "Menu", close: "Close" },
    backTop: "Back to top",
  },
  pt: {
    brand: "Caio Frota",
    nav: { about: "Sobre", projects: "Projetos", content: "Conteúdo", contact: "Contato" },
    hero: {
      title1: "Engenheiro de Software &",
      title2: "Criador de Coisas Úteis",
      subtitle:
        "Integrações com Node.js, Next.js e automações que conectam sistemas e pessoas. Código com propósito, estética e confiabilidade real.",
      ctaPrimary: "Ver projetos",
      ctaSecondary: "Falar comigo",
      availability: "Disponível para colaborações",
      badge: "Full‑stack com foco em Integrações",
    },
    about: {
      kicker: "Quem sou eu",
      title: "Soluções simples para problemas complexos",
      subtitle: "Senior Software Engineer, Tech Lead e criador de experiências que juntam código, design e impacto real.",
      cards: [
        {
          title: "Integrações & Arquitetura",
          text: "Pipelines resilientes, testes automatizados, versionamento de contratos e observabilidade que evita pagodes às 3AM.",
        },
        {
          title: "Produtos & UX",
          text: "Interfaces leves e humanas, animações sutis e foco na clareza. A forma serve a função — e encanta.",
        },
        { title: "Conteúdo & Comunidade", text: "Compartilho aprendizados com sinceridade e humor, aproximando iniciantes e experts." },
      ],
    },
    portfolio: {
      kicker: "Portfólio selecionado",
      title: "Projetos & apostas recentes",
      subtitle: "De integrações críticas a experiências criativas. Destaques:",
      inProgress: "Em andamento",
    },
    pillars: {
      kicker: "Para a comunidade",
      title: "Conteúdo que gosto de produzir",
      subtitle: "Educação prática, humor leve e estética cuidadosa.",
      items: [
        { title: "Engenharia de Software", blurb: "Dicas práticas de back-end, integrações robustas e padrões que escalam." },
        { title: "Automação & IoT", blurb: "Projetos mão-na-massa com ESP32/8266, voz, sensores e dashboards." },
        { title: "Criação & Marca Pessoal", blurb: "Reels, roteiros e storytelling técnico com humor e propósito." },
      ],
    },
    cta: {
      title: "Mentorias 1:1",
      blurb: "Apoio para devs no início da carreira ou na transição para integrações e arquitetura.",
      button: "Agendar conversa",
    },
    contact: {
      kicker: "Vamos construir?",
      title: "Contato",
      subtitle: "Parcerias, consultorias rápidas, integrações complexas — ou apenas um oi.",
    },
    form: {
      name: "Seu nome",
      email: "E-mail",
      message: "Mensagem",
      placeholderName: "Como posso te chamar?",
      placeholderEmail: "seu@email.com",
      placeholderMsg: "Me conte um pouco do seu desafio…",
      send: "Enviar",
      demo: "*Este é um formulário demonstrativo. Integre com sua API ou serviço de e-mail.",
    },
    footer: { madeWith: (year: number) => `© ${year} Caio Frota. Feito com carinho & TypeScript.` },
    socials: { github: "GitHub", linkedin: "LinkedIn", email: "E-mail" },
    menu: { open: "Menu", close: "Fechar" },
    backTop: "Voltar ao topo",
  },
};

type Lang = keyof typeof I18N;

// ——————————————————————————————————————————
// Utilities: language + theme managers
// ——————————————————————————————————————————
function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const browser = (typeof navigator !== "undefined" && navigator.language) || "en";
    const preferred: Lang = browser.toLowerCase().startsWith("pt") ? "pt" : "en";
    const stored = (typeof localStorage !== "undefined" && (localStorage.getItem("cf:lang") as Lang)) || preferred;
    setLang(stored);
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("cf:lang", lang);
      document.documentElement.lang = lang === "pt" ? "pt-BR" : "en-US";
    } catch {}
  }, [lang]);
  return [lang, setLang];
}

function useTheme(): ["light" | "dark", () => void] {
  const [theme, setTheme] = useState<"light" | "dark">("dark"); // dark-first
  useEffect(() => {
    // Dark as default, but respect prior choice
    const stored = typeof localStorage !== "undefined" ? localStorage.getItem("cf:theme") : null;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = (stored as "light" | "dark") || (prefersDark ? "dark" : "dark");
    setTheme(initial);
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("cf:theme", next);
    } catch {}
  };
  return [theme, toggle];
}

function useT(lang: Lang) {
  return useMemo(() => I18N[lang], [lang]);
}

// ——————————————————————————————————————————
// Data (content)
// ——————————————————————————————————————————
const projects = [
  {
    title: "HealthTech Integrations",
    blurb: "Middleware & pipelines (FHIR/HL7) focused on reliability, testing and observability.",
    tags: ["Node.js", "FHIR", "HL7", "Kafka"],
  },
  {
    title: "CF Inova Tech – Products",
    blurb: "Web & mobile apps, e‑commerce and custom automations. Performance with elegant DX.",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Vercel"],
  },
  {
    title: "Home Assistant • DIY Alexa",
    blurb: "ESP32 + wake word + dashboards & routines that make a smart home actually smart.",
    tags: ["ESP32", "I²S", "Home Assistant", "TypeScript"],
  },
  {
    title: "Lu's 30 Days",
    blurb: "Romantic gamification: daily puzzles, progress, QR codes and soundtracks.",
    tags: ["Next.js", "Framer Motion", "UX", "Tailwind"],
  },
];

const socials = [
  { key: "github", icon: Github, href: "https://github.com/jcaiofrota" },
  { key: "linkedin", icon: Linkedin, href: "https://www.linkedin.com/in/caiofrota/" },
  { key: "email", icon: Mail, href: "mailto:oi@caiofrota.com" },
] as const;

// ——————————————————————————————————————————
// Page
// ——————————————————————————————————————————
export default function HomePage() {
  const [lang, setLang] = useLang();
  const [theme, toggleTheme] = useTheme();
  const t = useT(lang);

  const navItems = [
    { label: t.nav.about, href: "#about" },
    { label: t.nav.projects, href: "#projects" },
    { label: t.nav.content, href: "#content" },
    { label: t.nav.contact, href: "#contact" },
  ];

  // Smooth in-page scroll handler
  const onNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    // Theme scope on wrapper ensures dark-first without relying on <html> class
    <div className={theme === "dark" ? "dark" : ""}>
      <main className="relative min-h-screen overflow-hidden bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
        <Backdrop />
        <TopNav
          brand={t.brand}
          navItems={navItems}
          theme={theme}
          onToggleTheme={toggleTheme}
          lang={lang}
          onChangeLang={setLang}
          onNavClick={onNavClick}
          t={t}
        />
        <Hero t={t} />
        <About t={t} />
        <Projects t={t} />
        <Content t={t} />
        <Contact t={t} lang={lang} />
        <Footer t={t} />
        <ScrollToTop label={t.backTop} />
      </main>
    </div>
  );
}

// ——————————————————————————————————————————
// Atoms / Primitives
// ——————————————————————————————————————————
function Backdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* Stronger glow for contrast */}
      <div
        className={`absolute -top-20 left-1/2 h-168 w-2xl -translate-x-1/2 rounded-full blur-3xl opacity-70 bg-linear-to-tr ${TOKENS.accent}`}
        aria-hidden
      />
      {/* subtle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,.06)_1px,transparent_1px)] bg-size-[18px_18px] dark:opacity-40" />
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <div className={`${TOKENS.pill} ${TOKENS.accent}`}>{children}</div>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`${TOKENS.card} ${className}`}>{children}</div>;
}

function SectionHeading({ kicker, title, subtitle }: { kicker?: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {kicker ? <Pill>{kicker}</Pill> : null}
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-5xl">{title}</h2>
      {subtitle ? <p className="mt-3 text-base text-neutral-800 dark:text-neutral-300/90 md:text-lg">{subtitle}</p> : null}
    </div>
  );
}

function TopNav({
  brand,
  navItems,
  theme,
  onToggleTheme,
  lang,
  onChangeLang,
  onNavClick,
  t,
}: {
  brand: string;
  navItems: { label: string; href: string }[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
  lang: Lang;
  onChangeLang: (l: Lang) => void;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  t: ReturnType<typeof useT>;
}) {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    onNavClick(e, href);
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 ${elevated ? "border-b shadow-sm" : "border-b"} border-neutral-200/60 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/60 dark:border-neutral-800/60 dark:bg-black/40 dark:supports-backdrop-filter:bg-black/30`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="#home" className="inline-flex items-center gap-2" onClick={(e) => onNavClick(e as any, "#home") as any}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-neutral-50 shadow-sm dark:bg-neutral-100 dark:text-neutral-900">
            <Sparkles className="h-4.5 w-4.5" />
          </span>
          <span className="font-semibold tracking-tight">{brand}</span>
        </Link>

        {/* Mobile: hamburger */}
        <button
          aria-label={open ? t.menu.close : t.menu.open}
          onClick={() => setOpen((v) => !v)}
          className={`md:hidden inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${TOKENS.ring} border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800`}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => onNavClick(e, n.href)}
              className="text-sm font-medium text-neutral-800 transition hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white"
            >
              {n.label}
            </a>
          ))}
          <LanguageSwitcher lang={lang} onChange={onChangeLang} />
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t border-neutral-200/60 bg-white/95 px-4 py-3 dark:border-neutral-800/60 dark:bg-neutral-950/95">
          <div className="flex flex-col gap-3">
            {navItems.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={(e) => handleClick(e, n.href)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                {n.label}
              </a>
            ))}
            <div className="flex items-center justify-between gap-3 pt-2">
              <LanguageSwitcher lang={lang} onChange={onChangeLang} />
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: "light" | "dark"; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${TOKENS.ring} border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />} {theme === "dark" ? "Dark" : "Light"}
    </button>
  );
}

function LanguageSwitcher({ lang, onChange }: { lang: Lang; onChange: (l: Lang) => void }) {
  return (
    <div className="inline-flex items-center gap-2">
      <Languages className="h-4 w-4 opacity-70" />
      <select
        value={lang}
        onChange={(e) => onChange(e.target.value as Lang)}
        className={`rounded-lg border px-2 py-1 text-xs font-medium ${TOKENS.ring} border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900`}
        aria-label="Language"
      >
        <option value="en">EN</option>
        <option value="pt">PT</option>
      </select>
    </div>
  );
}

// ——————————————————————————————————————————
// Hero (with image)
// ——————————————————————————————————————————
function Hero({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <section id="home" className="relative mx-auto max-w-6xl px-4 pb-12 pt-16 md:px-6 md:pb-20 md:pt-24">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl"
          >
            {t.hero.title1}
            <br className="hidden sm:block" /> {t.hero.title2}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.07 }}
            className="mt-4 max-w-xl text-base text-neutral-800 dark:text-neutral-300 md:text-lg"
          >
            {t.hero.subtitle}
          </motion.p>
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
              className={`group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${TOKENS.accent} px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-transform active:scale-[.98]`}
            >
              {t.hero.ctaPrimary}
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
              {t.hero.ctaSecondary}
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-8 flex items-center gap-4"
          >
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
              >
                <s.icon className="h-4 w-4" /> {I18N.en.socials[s.key as keyof typeof I18N.en.socials]}
              </a>
            ))}
          </motion.div>
        </div>

        {/* Hero visual */}
        <div className="relative">
          <Card className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden p-0">
            <Image
              src="/hero-caiofrota.jpg"
              alt="Caio Frota — portrait / creation"
              fill
              sizes="(max-width: 768px) 80vw, 400px"
              className="object-cover"
              priority
            />
            <div className="absolute left-4 top-4 hidden rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white md:block">
              {t.hero.availability}
            </div>
            <div className="absolute bottom-4 left-4">
              <Pill>
                <Globe className="h-3.5 w-3.5" /> {t.hero.badge}
              </Pill>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

// ——————————————————————————————————————————
// About
// ——————————————————————————————————————————
function About({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading kicker={t.about.kicker} title={t.about.title} subtitle={t.about.subtitle} />
      <div className="grid gap-6 md:grid-cols-3">
        {t.about.cards.map((c) => (
          <Card key={c.title}>
            <h3 className="text-lg font-semibold tracking-tight">{c.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{c.text}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ——————————————————————————————————————————
// Projects
// ——————————————————————————————————————————
function Projects({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading kicker={t.portfolio.kicker} title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-800/5 ring-0 transition hover:shadow-2xl hover:ring-1 hover:ring-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:ring-neutral-700"
          >
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> {t.portfolio.inProgress}
            </div>
            <h3 className="text-xl font-semibold tracking-tight">{p.title}</h3>
            <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{p.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-neutral-200 px-2.5 py-1 text-xs text-neutral-700 dark:border-neutral-800 dark:text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div
              className={`pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-gradient-to-tr opacity-25 blur-3xl ${TOKENS.accent}`}
            />
          </motion.article>
        ))}
      </div>
    </section>
  );
}

// ——————————————————————————————————————————
// Content
// ——————————————————————————————————————————
function Content({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <section id="content" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading kicker={t.pillars.kicker} title={t.pillars.title} subtitle={t.pillars.subtitle} />
      <div className="grid gap-6 md:grid-cols-3">
        {[Code2, Cpu, PenTool].map((Icon, idx) => (
          <Card key={idx}>
            <div className="mb-3">
              <Pill>
                <Icon className="h-5 w-5" /> {t.pillars.items[idx].title}
              </Pill>
            </div>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">{t.pillars.items[idx].blurb}</p>
          </Card>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6 }}
        className={`mt-10 overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-r ${TOKENS.accent} p-8 text-white shadow-2xl dark:border-neutral-800`}
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">{t.cta.title}</h3>
            <p className="mt-1 text-sm/relaxed opacity-95">{t.cta.blurb}</p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-neutral-900 shadow-xl transition hover:bg-neutral-50 active:scale-[.98]"
          >
            {t.cta.button} <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </motion.div>
    </section>
  );
}

// ——————————————————————————————————————————
// Contact
// ——————————————————————————————————————————
function Contact({ t, lang }: { t: ReturnType<typeof useT>; lang: Lang }) {
  const labels = I18N[lang];
  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionHeading kicker={t.contact.kicker} title={t.contact.title} subtitle={t.contact.subtitle} />
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4">
            <label className="text-sm">
              <span className="mb-1 block text-neutral-800 dark:text-neutral-200">{labels.form.name}</span>
              <input
                className={`w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 ${TOKENS.ring}`}
                placeholder={labels.form.placeholderName}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-neutral-800 dark:text-neutral-200">{labels.form.email}</span>
              <input
                type="email"
                className={`w-full rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 ${TOKENS.ring}`}
                placeholder={labels.form.placeholderEmail}
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-neutral-800 dark:text-neutral-200">{labels.form.message}</span>
              <textarea
                rows={4}
                className={`w-full resize-none rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 ${TOKENS.ring}`}
                placeholder={labels.form.placeholderMsg}
              />
            </label>
            <button
              className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${TOKENS.accent} px-5 py-3 text-sm font-semibold text-white shadow-xl transition active:scale-[.98]`}
            >
              {labels.form.send} <ArrowRight className="h-4 w-4" />
            </button>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">{labels.form.demo}</p>
          </form>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold tracking-tight">Shortcuts</h3>
          <div className="mt-4 grid gap-3">
            {socials.map((s) => (
              <a
                key={s.key}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-between rounded-2xl border border-neutral-200 px-4 py-3 text-sm transition hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
              >
                <span className="inline-flex items-center gap-3">
                  <s.icon className="h-4 w-4 opacity-80" /> {I18N[lang].socials[s.key]}
                </span>
                <ArrowRight className="h-4 w-4 translate-x-0 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100" />
              </a>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-neutral-200 p-4 text-sm dark:border-neutral-800">
            <p className="leading-relaxed text-neutral-700 dark:text-neutral-300">
              I also help companies with quick architecture & integrations consulting and performance diagnostics.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}

// ——————————————————————————————————————————
// Scroll-to-top
// ——————————————————————————————————————————
function ScrollToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  if (!visible) return null;
  return (
    <button
      onClick={scrollTop}
      aria-label={label}
      className={`fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-lg transition ${TOKENS.ring} border-neutral-300 bg-white/90 backdrop-blur hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:bg-neutral-900`}
    >
      <ChevronUp className="h-4 w-4" /> {label}
    </button>
  );
}

// ——————————————————————————————————————————
// Footer
// ——————————————————————————————————————————
function Footer({ t }: { t: ReturnType<typeof useT> }) {
  return (
    <footer className="border-t border-neutral-200/70 py-10 dark:border-neutral-800/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row md:px-6">
        <p className="text-sm text-neutral-700 dark:text-neutral-400">{t.footer.madeWith(new Date().getFullYear())}</p>
        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.key}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-neutral-800 transition hover:text-neutral-950 dark:text-neutral-300 dark:hover:text-white"
            >
              <s.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{I18N.en.socials[s.key as keyof typeof I18N.en.socials]}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
