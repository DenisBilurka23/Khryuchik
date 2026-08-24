import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/server/cron/cron-auth";
import { cleanupChitChatsQuoteShipments } from "@/server/shipping/services/chitchats-cleanup.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: NextRequest) => {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = await cleanupChitChatsQuoteShipments();

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Chit Chats quote cleanup failed", error);

    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
};
