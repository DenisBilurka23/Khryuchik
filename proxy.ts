import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ADMIN_LOCALE_COOKIE_NAME,
  ADMIN_LOCALE_QUERY_PARAM,
  defaultLocale,
  isLocale,
  locales,
} from "@/i18n/config";
import {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  defaultCountry,
  getCountryFromGeoHeaders,
  isCountryCode,
} from "@/utils";

const LOCALE_HEADER = "x-khryuchik-locale";

const isAdminPath = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

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

const getPreferredCountry = (request: NextRequest) => {
  const cookieCountry = request.cookies.get(COUNTRY_COOKIE_NAME)?.value;

  if (isCountryCode(cookieCountry)) {
    return cookieCountry;
  }

  return getCountryFromGeoHeaders(request.headers) ?? defaultCountry;
};

const getAdminCookieLocale = (request: NextRequest) => {
  const locale = request.cookies.get(ADMIN_LOCALE_COOKIE_NAME)?.value;

  return locale && isLocale(locale) ? locale : null;
};

const withRequestContextHeaders = (
  request: NextRequest,
  locale: string,
  country: string,
) => {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  requestHeaders.set(COUNTRY_HEADER, country);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
};

const getLocaleFromPathname = (pathname: string) => {
  const matchedLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  return matchedLocale ?? defaultLocale;
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const country = getPreferredCountry(request);

  if (isAdminPath(pathname)) {
    const queryLocale = request.nextUrl.searchParams.get(ADMIN_LOCALE_QUERY_PARAM);

    if (queryLocale && isLocale(queryLocale)) {
      const redirectedUrl = request.nextUrl.clone();
      redirectedUrl.searchParams.delete(ADMIN_LOCALE_QUERY_PARAM);

      const response = NextResponse.redirect(redirectedUrl);
      response.cookies.set(ADMIN_LOCALE_COOKIE_NAME, queryLocale, {
        path: "/",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });

      return response;
    }

    return withRequestContextHeaders(
      request,
      getAdminCookieLocale(request) ?? defaultLocale,
      country,
    );
  }

  const allowDefaultLocalePath =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/account" ||
    pathname === "/cart" ||
    pathname === "/shop" ||
    pathname.startsWith("/reset-password/") ||
    pathname.startsWith("/account/") ||
    pathname === "/products" ||
    pathname.startsWith("/products/");

  if (allowDefaultLocalePath) {
    return withRequestContextHeaders(request, defaultLocale, country);
  }

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    return withRequestContextHeaders(
      request,
      getLocaleFromPathname(pathname),
      country,
    );
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
