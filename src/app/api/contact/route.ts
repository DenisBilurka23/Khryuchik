import { NextResponse } from "next/server";

import { CONTACT_RATE_LIMIT } from "@/constants/rate-limit";
import {
  consumeRateLimit,
  getClientIpKey,
} from "@/server/rate-limit/rate-limit.service";

import { defaultLocale, isLocale } from "@/i18n/config";
import { sendContactMessage } from "@/server/email/contact-message";
import { notifyAdminContactMessage } from "@/server/payments/telegram";
import { ContactErrorCode, type ContactMessageInput } from "@/types/contact";
import { EMAIL_PATTERN } from "@/utils/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const requestedLocale =
      typeof body.locale === "string" ? body.locale : defaultLocale;
    const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

    if (!name) {
      return NextResponse.json(
        { error: ContactErrorCode.InvalidName },
        { status: 400 },
      );
    }

    if (!email || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { error: ContactErrorCode.InvalidEmail },
        { status: 400 },
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: ContactErrorCode.InvalidMessage },
        { status: 400 },
      );
    }

    const rateLimit = consumeRateLimit({
      key: `contact:${getClientIpKey(request.headers)}`,
      ...CONTACT_RATE_LIMIT,
    });

    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        { error: ContactErrorCode.TooManyRequests },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
        },
      );
    }

    const contactMessage: ContactMessageInput = {
      name,
      email,
      message,
      locale,
    };

    const [emailSent, telegramSent] = await Promise.all([
      sendContactMessage(contactMessage),
      notifyAdminContactMessage(contactMessage),
    ]);

    if (!emailSent && !telegramSent) {
      return NextResponse.json(
        { error: ContactErrorCode.UnexpectedError },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: ContactErrorCode.UnexpectedError },
      { status: 500 },
    );
  }
}
