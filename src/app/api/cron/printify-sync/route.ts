import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  PrintifyImportError,
  syncPrintifyCatalog,
} from "@/server/printify/services/printify-catalog.service";

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
