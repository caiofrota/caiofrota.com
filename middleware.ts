import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

const SUPPORTED_LOCALES = ["en", "br"] as const;
const DEFAULT_LOCALE = "en";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_FILE.test(pathname) || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isLocalePrefixed = SUPPORTED_LOCALES.some((locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`));
  if (isLocalePrefixed) {
    return NextResponse.next();
  }

  const cookieLocale = req.cookies.get("locale")?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale as any)) {
    return NextResponse.redirect(new URL(`/${cookieLocale}${pathname}`, req.url));
  }

  const acceptLang = req.headers.get("accept-language") ?? "";
  const preferred = acceptLang.toLowerCase().startsWith("pt") ? "br" : DEFAULT_LOCALE;

  return NextResponse.redirect(new URL(`/${preferred}${pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
