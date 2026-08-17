import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { buildEmailVerificationUrl } from "@/server/auth/verification-url";
import { sendEmailVerificationEmail } from "@/server/email/email-verification";
import { sendWelcomeEmail } from "@/server/email/welcome";
import { registerUser } from "@/server/users/services/users.service";
import { AuthInputErrorCode } from "@/types/auth";
import { formatPersonName } from "@/utils";
import { EMAIL_PATTERN } from "@/utils/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const firstName =
      typeof body.firstName === "string" ? body.firstName.trim() : "";
    const lastName =
      typeof body.lastName === "string" ? body.lastName.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const requestedLocale =
      typeof body.locale === "string" ? body.locale : defaultLocale;
    const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json(
        { error: AuthInputErrorCode.MissingFields },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: AuthInputErrorCode.InvalidEmail },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: AuthInputErrorCode.PasswordTooShort },
        { status: 400 },
      );
    }

    const result = await registerUser({
      firstName,
      lastName,
      email,
      phone,
      password,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.reason }, { status: 409 });
    }

    if (!result.verificationToken) {
      void sendWelcomeEmail(
        email,
        formatPersonName(firstName, lastName),
        locale,
      );

      return NextResponse.json({ ok: true, requiresVerification: false });
    }

    void sendEmailVerificationEmail(
      email,
      buildEmailVerificationUrl(locale, result.verificationToken),
      locale,
    );

    return NextResponse.json({ ok: true, requiresVerification: true });
  } catch {
    return NextResponse.json(
      { error: AuthInputErrorCode.UnexpectedError },
      { status: 500 },
    );
  }
}
