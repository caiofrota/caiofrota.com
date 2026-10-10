"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (/^\/(br|en)\/links\/?$/.test(pathname)) return null;
  return children;
}
