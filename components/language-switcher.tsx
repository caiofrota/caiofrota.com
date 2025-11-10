import { Languages } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import { Locale } from "node_modules/next/dist/compiled/@vercel/og/satori";

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const segments = pathname.split("/");
  const currentLocale = (segments[1] as Locale) || "en-US";
  const restPath = "/" + segments.slice(2).join("/");

  function switchTo(locale: Locale) {
    document.cookie = `locale=${locale}; max-age=31536000; path=/`;
    router.push(`/${locale}${restPath || ""}`);
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Languages className="h-4 w-4 opacity-70" />
      <select
        value={currentLocale}
        onChange={(e) => switchTo(e.target.value as Locale)}
        className={`rounded-lg border px-2 py-1 text-xs font-medium cf-ring border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900`}
        aria-label="Language"
      >
        <option value="en">English</option>
        <option value="br">Português</option>
      </select>
    </div>
  );
}
