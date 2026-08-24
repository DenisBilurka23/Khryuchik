import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { cleanupChitChatsQuoteShipments } from "@/server/shipping/services/chitchats-cleanup.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const isAuthorized = (request: NextRequest) => {
  const secret = process.env.CRON_SECRET;

  return (
    Boolean(secret) &&
    request.headers.get("authorization") === `Bearer ${secret}`
  );
};

export const GET = async (request: NextRequest) => {
  if (!isAuthorized(request)) {
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
