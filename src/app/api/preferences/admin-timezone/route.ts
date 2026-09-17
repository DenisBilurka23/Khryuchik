import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_TIME_ZONE_COOKIE_NAME } from "@/i18n/config";
import { FALLBACK_TIME_ZONE, isSupportedTimeZone } from "@/utils";

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as
    | { timeZone?: string }
    | null;
  const timeZone = isSupportedTimeZone(payload?.timeZone)
    ? payload.timeZone
    : FALLBACK_TIME_ZONE;
  const response = NextResponse.json({ ok: true, timeZone });

  response.cookies.set(ADMIN_TIME_ZONE_COOKIE_NAME, timeZone, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
};
