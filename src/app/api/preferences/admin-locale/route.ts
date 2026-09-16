import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  ADMIN_LOCALE_COOKIE_NAME,
  defaultLocale,
  isLocale,
} from "@/i18n/config";

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as
    | { locale?: string }
    | null;
  const locale = payload?.locale && isLocale(payload.locale)
    ? payload.locale
    : defaultLocale;
  const response = NextResponse.json({ ok: true, locale });

  response.cookies.set(ADMIN_LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
};