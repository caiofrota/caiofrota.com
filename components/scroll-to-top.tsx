import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  label?: string;
  aboveFooter: boolean;
};

export function ScrollToTop({ label, aboveFooter }: Props) {
  const [visible, setVisible] = useState(false);
  const [above, setAbove] = useState(true);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (aboveFooter) {
      const footer = document.querySelector("footer");
      if (!footer) return;

      const observer = new IntersectionObserver(([entry]) => setAbove(!entry.isIntersecting), { threshold: 0 });

      observer.observe(footer);
      return () => observer.disconnect();
    }
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  if (!visible) return null;

  return (
    <button
      onClick={scrollTop}
      aria-label={label}
      className={`fixed ${above ? "bottom-6" : "bottom-30"} right-6 z-50 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-lg transition cf-ring border-neutral-300 bg-white/90 backdrop-blur hover:bg-white dark:border-neutral-700 dark:bg-neutral-900/90 dark:hover:bg-neutral-900`}
    >
      <ChevronUp className="h-4 w-4" /> {label}
    </button>
  );
}
