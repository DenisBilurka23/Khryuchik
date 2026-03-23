import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale, locales } from "@/i18n/config";

const getPreferredLocale = (request: NextRequest) => {
  const acceptLanguage = request.headers.get("accept-language");

  if (!acceptLanguage) {
    return defaultLocale;
  }

  const preferredLocales = acceptLanguage
    .split(",")
    .map((value) => value.trim().split(";")[0]?.toLowerCase())
    .filter(Boolean)
    .flatMap((value) => {
      const language = value.split("-")[0];
      return language && language !== value ? [value, language] : [value];
    });

  const matchedLocale = preferredLocales.find((value) => isLocale(value));

  return matchedLocale ?? defaultLocale;
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  const allowDefaultLocalePath =
    pathname === "/" ||
    pathname === "/shop" ||
    pathname === "/products" ||
    pathname.startsWith("/products/");

  if (allowDefaultLocalePath) {
    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const redirectedUrl = request.nextUrl.clone();

  redirectedUrl.pathname =
    pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(redirectedUrl);
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
