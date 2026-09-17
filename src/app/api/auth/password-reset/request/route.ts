import { NextResponse } from "next/server";

import { AUTH_RATE_LIMIT } from "@/constants/rate-limit";
import {
  consumeRateLimit,
  getClientIpKey,
} from "@/server/rate-limit/rate-limit.service";

import { defaultLocale, isLocale } from "@/i18n/config";
import { sendPasswordResetEmail } from "@/server/email/password-reset";
import { requestPasswordReset } from "@/server/users/services/users.service";
import { AuthInputErrorCode } from "@/types/auth";
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
    const requestedLocale =
      typeof body.locale === "string" ? body.locale : defaultLocale;
    const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: AuthInputErrorCode.InvalidEmail },
        { status: 400 },
      );
    }

    const rateLimit = consumeRateLimit({
      key: `password-reset:${getClientIpKey(request.headers)}`,
      ...AUTH_RATE_LIMIT,
    });

    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        { error: AuthInputErrorCode.TooManyRequests },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    const token = await requestPasswordReset(email);

    if (token) {
      const resetUrl = `${getSafeOrigin(origin)}${getLocalizedPath(locale, `/reset-password/${token}`)}`;

      if (process.env.NODE_ENV !== "production") {
        console.info(`Password reset URL for ${email}: ${resetUrl}`);
      }

      await sendPasswordResetEmail(email, resetUrl, locale);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: AuthInputErrorCode.UnexpectedError },
      { status: 500 },
    );
  }
}
