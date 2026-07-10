import { NextResponse } from "next/server";

import { unsubscribeFromNewsletter } from "@/server/newsletter/services/newsletter.service";
import { NewsletterErrorCode } from "@/types/newsletter";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";

    if (!token) {
      return NextResponse.json(
        { error: NewsletterErrorCode.UnexpectedError },
        { status: 400 },
      );
    }

    await unsubscribeFromNewsletter(token);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: NewsletterErrorCode.UnexpectedError },
      { status: 500 },
    );
  }
}
