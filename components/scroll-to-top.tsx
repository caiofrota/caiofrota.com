"use client";

import { useReducedMotion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  label?: string;
  aboveFooter: boolean;
};

export function ScrollToTop({ label, aboveFooter }: Props) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const isPortuguese = pathname.split("/")[1] === "br";
  const buttonLabel = label?.trim() || (isPortuguese ? "Voltar ao topo" : "Back to top");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!aboveFooter) {
      setFooterVisible(false);
      return;
    }

    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0 });

    observer.observe(footer);
    return () => observer.disconnect();
  }, [aboveFooter]);

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label={buttonLabel}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-6 z-50 inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white/90 px-3 py-2 text-xs font-semibold shadow-lg backdrop-blur transition-[bottom,opacity,transform,background-color,border-color] duration-300 ease-out hover:bg-white motion-reduce:transition-none dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:bg-neutral-900 cf-ring ${aboveFooter && footerVisible ? "bottom-30" : "bottom-6"} ${visible ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"}`}
    >
      <ChevronUp className="size-4" aria-hidden="true" />
      {buttonLabel}
    </button>
  );
}
