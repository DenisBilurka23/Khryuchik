import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ADMIN_LOCALE_COOKIE_NAME,
  defaultLocale,
  isLocale,
  LOCALE_HEADER,
  locales,
} from "@/i18n/config";
import {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  defaultCountry,
  getCountryFromGeoHeaders,
  isIsoCountryCode,
} from "@/utils";

const isAdminPath = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

const getPreferredCountry = (request: NextRequest) => {
  const cookieCountry = request.cookies.get(COUNTRY_COOKIE_NAME)?.value;

  if (isIsoCountryCode(cookieCountry)) {
    return cookieCountry;
  }

  return getCountryFromGeoHeaders(request.headers) ?? defaultCountry;
};

const getAdminCookieLocale = (request: NextRequest) => {
  const locale = request.cookies.get(ADMIN_LOCALE_COOKIE_NAME)?.value;

  return locale && isLocale(locale) ? locale : null;
};

const stripDefaultLocalePrefix = (pathname: string) => {
  if (pathname === `/${defaultLocale}`) {
    return "/";
  }

  return pathname.startsWith(`/${defaultLocale}/`)
    ? pathname.slice(defaultLocale.length + 1)
    : null;
};

const getPrefixedLocale = (pathname: string) =>
  locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  ) ?? null;

const withRequestContextHeaders = (
  request: NextRequest,
  locale: string,
  country: string,
  rewriteTo?: URL,
) => {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);
  requestHeaders.set(COUNTRY_HEADER, country);

  const init = {
    request: {
      headers: requestHeaders,
    },
  };

  return rewriteTo
    ? NextResponse.rewrite(rewriteTo, init)
    : NextResponse.next(init);
};

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const country = getPreferredCountry(request);

  if (isAdminPath(pathname)) {
    return withRequestContextHeaders(
      request,
      getAdminCookieLocale(request) ?? defaultLocale,
      country,
    );
  }

  const unprefixedPathname = stripDefaultLocalePrefix(pathname);

  if (unprefixedPathname) {
    const redirectedUrl = request.nextUrl.clone();
    redirectedUrl.pathname = unprefixedPathname;

    return NextResponse.redirect(redirectedUrl, 308);
  }

  const prefixedLocale = getPrefixedLocale(pathname);

  if (prefixedLocale) {
    return withRequestContextHeaders(request, prefixedLocale, country);
  }

  const rewrittenUrl = request.nextUrl.clone();
  rewrittenUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;

  return withRequestContextHeaders(
    request,
    defaultLocale,
    country,
    rewrittenUrl,
  );
};

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|robots.txt|sitemap.xml).*)",
  ],
};
