import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  COUNTRY_COOKIE_NAME,
  defaultCountry,
  isCountryCode,
} from "@/utils";

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as
    | { country?: string }
    | null;
  const country = isCountryCode(payload?.country)
    ? payload.country
    : defaultCountry;

  const response = NextResponse.json({ ok: true, country });

  response.cookies.set(COUNTRY_COOKIE_NAME, country, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
};

export const GET = async (request: NextRequest) => {
  const countryParam = request.nextUrl.searchParams.get("country");
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? "/";
  const country = isCountryCode(countryParam) ? countryParam : defaultCountry;
  const redirectUrl = new URL(returnTo, request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(COUNTRY_COOKIE_NAME, country, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
};