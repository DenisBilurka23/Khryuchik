import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/server/cron/cron-auth";

import {
  PrintifyImportError,
  syncPrintifyCatalog,
} from "@/server/printify/services/printify-catalog.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: NextRequest) => {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cursor = request.nextUrl.searchParams.get("cursor")?.trim();

  try {
    const summary = await syncPrintifyCatalog(cursor || undefined);

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Printify catalog sync failed", error);

    return NextResponse.json(
      { error: error instanceof PrintifyImportError ? error.code : "failed" },
      { status: 500 },
    );
  }
};
