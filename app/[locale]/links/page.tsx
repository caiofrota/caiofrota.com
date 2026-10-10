import { localizedPath, routeLocale } from "lib/locale";
import { SOCIAL_LINKS } from "lib/social-links";
import { ArrowUpRight, Github, Globe, Linkedin, Bot } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import styles from "./links.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const portuguese = routeLocale(locale) === "br";
  const title = portuguese ? "Meus links" : "My links";
  const description = portuguese
    ? "Um pouco do meu universo: conheça o Jarvis, meus projetos e onde me encontrar."
    : "A little of my world: discover Jarvis, my projects and where to find me.";
  const url = `https://www.caiofrota.com${localizedPath(locale, "links")}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { "pt-BR": "https://www.caiofrota.com/br/links", "en-US": "https://www.caiofrota.com/en/links" },
    },
    openGraph: { title: `${title} | Caio Frota`, description, url },
  };
}

export default async function LinksPage({ params }: Props) {
  const { locale } = await params;
  const portuguese = routeLocale(locale) === "br";
  const links = [
    {
      title: portuguese ? "Meu site" : "My website",
      description: portuguese ? "Projetos, ideias e um pouco sobre mim" : "Projects, ideas and a little about me",
      href: localizedPath(locale),
      icon: Globe,
      external: false,
    },
    {
      title: "GitHub",
      description: portuguese ? "O que estou construindo, em código" : "What I’m building, in code",
      href: SOCIAL_LINKS.find((link) => link.type === "github")!.url,
      icon: Github,
      external: true,
    },
    {
      title: "LinkedIn",
      description: portuguese ? "Minha trajetória e novas conexões" : "My journey and new connections",
      href: SOCIAL_LINKS.find((link) => link.type === "linkedin")!.url,
      icon: Linkedin,
      external: true,
    },
  ];

  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.portrait}>
            <Image src="/images/caio-frota.jpg" alt="Caio Frota" width={120} height={120} priority className={styles.photo} />
          </div>
          <h1 className={styles.name}>
            Caio Frota<span>.</span>
          </h1>
          <p className={styles.role}>{portuguese ? "Software · Automação · IA" : "Software · Automation · AI"}</p>
          <p className={styles.intro}>
            {portuguese ? "Ideias viram código. Código vira realidade." : "Ideas become code. Code becomes reality."}
          </p>
        </header>
        <nav aria-label={portuguese ? "Meus links" : "My links"} className={styles.links}>
          <a href="https://github.com/caiofrota/jarvis" target="_blank" rel="noopener noreferrer" className={styles.jarvis}>
            <span className={styles.jarvisIcon}>
              <Bot size={24} aria-hidden="true" />
            </span>
            <div className={styles.jarvisCopy}>
              <h2 className={styles.jarvisTitle}>Jarvis</h2>
              <p className={styles.description}>
                {portuguese ? "Meu Jarvis. Conheça o projeto no GitHub." : "My Jarvis. Explore the project on GitHub."}
              </p>
            </div>
            <ArrowUpRight size={22} className={styles.jarvisArrow} aria-hidden="true" />
          </a>
          {links.map(({ title, description, href, icon: Icon, external }) => (
            <Link
              key={title}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className={styles.link}
            >
              <span className={styles.linkIcon}>
                <Icon size={21} aria-hidden="true" />
              </span>
              <div className={styles.linkCopy}>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <ArrowUpRight size={20} className={styles.linkArrow} aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <p className={styles.footer}>
          {portuguese ? "Feito com amor ❤️ e um pouco de café ☕." : "Made with love ❤️ and a little coffee ☕."}
        </p>
      </div>
    </section>
  );
}
