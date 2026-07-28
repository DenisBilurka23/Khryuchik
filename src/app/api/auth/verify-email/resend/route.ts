import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { buildEmailVerificationUrl } from "@/server/auth/verification-url";
import { sendEmailVerificationEmail } from "@/server/email/email-verification";
import { requestEmailVerification } from "@/server/users/services/users.service";
import { AuthInputErrorCode } from "@/types/auth";
import { EMAIL_PATTERN } from "@/utils/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const requestedLocale =
      typeof body.locale === "string" ? body.locale : defaultLocale;
    const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: AuthInputErrorCode.InvalidEmail },
        { status: 400 },
      );
    }

    const token = await requestEmailVerification(email);

    if (token) {
      void sendEmailVerificationEmail(
        email,
        buildEmailVerificationUrl(locale, token),
        locale,
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: AuthInputErrorCode.UnexpectedError },
      { status: 500 },
    );
  }
}
