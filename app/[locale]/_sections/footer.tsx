"use client";
import { SocialBar } from "components/social-bar";
import { useTranslator } from "i18n/provider";

export function Footer({ ref }: React.PropsWithChildren<{ ref?: React.Ref<HTMLElement> }>) {
  const { t } = useTranslator();

  return (
    <footer ref={ref} id="footer" className="border-t border-neutral-200/70 py-10 dark:border-neutral-800/70">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 lg:flex-row md:px-6">
        <p className="text-sm text-center md:text-left text-neutral-700 dark:text-neutral-400">
          {t.footer.madeWith.replace("{{year}}", new Date().getFullYear().toString())}
        </p>
        <SocialBar
          socials={[
            { type: "github", url: "https://github.com/caiofrota" },
            { type: "instagram", url: "https://instagram.com/jcaiofrota" },
            { type: "linkedin", url: "https://www.linkedin.com/in/caiofrota/" },
          ]}
          showLabels={true}
        />
      </div>
    </footer>
  );
}
