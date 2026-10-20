import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/server/cron/cron-auth";
import { getJetprintConfig } from "@/server/jetprint/client";
import { syncJetprintVariantAvailability } from "@/server/jetprint/services/jetprint-catalog.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: NextRequest) => {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!getJetprintConfig()) {
    return NextResponse.json({ status: "not-configured" });
  }

  const cursor = request.nextUrl.searchParams.get("cursor")?.trim();

  try {
    const summary = await syncJetprintVariantAvailability(cursor || undefined);

    return NextResponse.json({ status: "ok", ...summary });
  } catch (error) {
    console.error("JetPrint variant availability check failed", error);

    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
};
