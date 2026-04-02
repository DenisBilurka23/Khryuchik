import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  COUNTRY_COOKIE_NAME,
  COUNTRY_HEADER,
  defaultCountry,
  geoCountryHeaderNames,
  getCountryFromCookieHeader,
  getCountryFromGeoHeaders,
  isCountryCode,
} from "@/shared/countries";

export const dynamic = "force-dynamic";

export const GET = async (request: NextRequest) => {
  const cookieHeader = request.headers.get("cookie");
  const cookieCountry = getCountryFromCookieHeader(cookieHeader);
  const proxyCountry = request.headers.get(COUNTRY_HEADER);
  const geoCountry = getCountryFromGeoHeaders(request.headers);
  const resolvedCountry = isCountryCode(cookieCountry)
    ? cookieCountry
    : isCountryCode(proxyCountry)
      ? proxyCountry
      : defaultCountry;
  const geoHeaders = Object.fromEntries(
    geoCountryHeaderNames.map((headerName) => [
      headerName,
      request.headers.get(headerName),
    ]),
  );

  const response = NextResponse.json({
    countryResolution: {
      cookieCountry,
      geoCountry,
      proxyCountry,
      resolvedCountry,
      defaultCountry,
    },
    request: {
      hasCountryCookie: Boolean(request.cookies.get(COUNTRY_COOKIE_NAME)?.value),
      host: request.headers.get("host"),
      pathname: request.nextUrl.pathname,
    },
    headers: {
      [COUNTRY_HEADER]: proxyCountry,
      cookieCountry,
      geo: geoHeaders,
    },
  });

  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
};