import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { sendWelcomeEmail } from "@/server/email/welcome";
import { verifyEmailWithToken } from "@/server/users/services/users.service";
import { AuthInputErrorCode } from "@/types/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const requestedLocale =
      typeof body.locale === "string" ? body.locale : defaultLocale;
    const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

    if (!token) {
      return NextResponse.json(
        { error: AuthInputErrorCode.MissingFields },
        { status: 400 },
      );
    }

    const result = await verifyEmailWithToken(token);

    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    void sendWelcomeEmail(result.email, result.name, locale);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: AuthInputErrorCode.UnexpectedError },
      { status: 500 },
    );
  }
}
