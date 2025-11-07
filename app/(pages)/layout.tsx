"use client";
import { Navbar } from "components/navbar";
import { ScrollToTop } from "components/scroll-to-top";
import { useTranslator } from "i18n";

type Props = {
  children: React.ReactNode;
};
export default function Layout({ children }: Props) {
  const { t } = useTranslator();

  const navItems = [
    { label: t.menu.about, href: "#about" },
    { label: t.menu.blog, href: "#blog" },
    { label: t.menu.resume, href: "#resume" },
    { label: t.menu.contact, href: "#contact" },
  ];

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();

    const doScroll = () => {
      const target = document.querySelector(href) as HTMLElement | null;
      if (!target) return;

      const header = document.querySelector("header") as HTMLElement | null;
      const headerH = header?.getBoundingClientRect().height ?? 0;

      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: "smooth" });
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(doScroll);
    });
  };

  return (
    <div>
      <main className="relative min-h-screen bg-slate-200 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
        <Navbar navItems={navItems} onNavClick={onNavClick} />
        {children}
        <ScrollToTop />
      </main>
    </div>
  );
}
