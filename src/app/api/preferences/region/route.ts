import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getActiveRegionCodes,
  getDefaultRegionCode,
} from "@/server/localization/localization.service";
import { isRegionCode, REGION_COOKIE_NAME } from "@/utils";

const resolveActiveRegion = async (value: unknown) => {
  const [activeCodes, defaultRegion] = await Promise.all([
    getActiveRegionCodes(),
    getDefaultRegionCode(),
  ]);

  return isRegionCode(value) && activeCodes.includes(value)
    ? value
    : defaultRegion;
};

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as {
    region?: string;
  } | null;
  const region = await resolveActiveRegion(payload?.region);

  const response = NextResponse.json({ ok: true, region });

  response.cookies.set(REGION_COOKIE_NAME, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
};

export const GET = async (request: NextRequest) => {
  const regionParam = request.nextUrl.searchParams.get("region");
  const returnTo = request.nextUrl.searchParams.get("returnTo") ?? "/";
  const region = await resolveActiveRegion(regionParam);
  const redirectUrl = new URL(returnTo, request.url);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(REGION_COOKIE_NAME, region, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
};
