import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { requestPasswordReset } from "@/server/users/services/users.service";
import { EMAIL_PATTERN } from "@/utils/validation";

const getLocalizedPath = (locale: string, path: string) =>
  locale === "en" ? path : `/${locale}${path}`;

const getSafeOrigin = (origin: string | undefined) => {
  if (!origin) {
    return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  }

  try {
    return new URL(origin).origin;
  } catch {
    return process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  }
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const origin = typeof body.origin === "string" ? body.origin : undefined;
    const requestedLocale = typeof body.locale === "string" ? body.locale : defaultLocale;
    const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "invalid_email" }, { status: 400 });
    }

    const token = await requestPasswordReset(email);

    if (token) {
      const resetUrl = `${getSafeOrigin(origin)}${getLocalizedPath(locale, `/reset-password/${token}`)}`;

      if (process.env.NODE_ENV !== "production") {
        console.info(`Password reset URL for ${email}: ${resetUrl}`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}