import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getActiveRegionCodes,
  getDefaultRegionCode,
} from "@/server/localization/localization.service";
import { COUNTRY_COOKIE_NAME } from "@/utils";

const resolveActiveCountry = async (value: string | null | undefined) => {
  const [activeCodes, defaultRegion] = await Promise.all([
    getActiveRegionCodes(),
    getDefaultRegionCode(),
  ]);

  return value && activeCodes.includes(value) ? value : defaultRegion;
};

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as {
    country?: string;
  } | null;
  const country = await resolveActiveCountry(payload?.country);

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
  const country = await resolveActiveCountry(countryParam);
  const redirectUrl = new URL(returnTo, request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(COUNTRY_COOKIE_NAME, country, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
};
