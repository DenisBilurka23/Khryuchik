import { NextResponse } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import {
  isSubscribedToNewsletter,
  setNewsletterSubscription,
} from "@/server/newsletter/services/newsletter.service";

export async function GET() {
  const session = await getServerAuthSession();
  const email = session?.user?.email;

  if (!session?.user?.id || !email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const subscribed = await isSubscribedToNewsletter(email);

  return NextResponse.json({ subscribed });
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerAuthSession();
    const email = session?.user?.email;

    if (!session?.user?.id || !email) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const subscribed = body?.subscribed === true;
    const requestedLocale =
      typeof body?.locale === "string" ? body.locale : defaultLocale;
    const locale = isLocale(requestedLocale) ? requestedLocale : defaultLocale;

    await setNewsletterSubscription(email, locale, subscribed);

    return NextResponse.json({ subscribed });
  } catch {
    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
}
