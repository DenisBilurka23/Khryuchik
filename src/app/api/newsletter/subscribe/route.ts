import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { subscribeToNewsletter } from "@/server/newsletter/services/newsletter.service";
import { NewsletterErrorCode } from "@/types/newsletter";
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
        { error: NewsletterErrorCode.InvalidEmail },
        { status: 400 },
      );
    }

    await subscribeToNewsletter(email, locale);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: NewsletterErrorCode.UnexpectedError },
      { status: 500 },
    );
  }
}
