import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/server/cron/cron-auth";
import { sweepOrphanedObjects } from "@/server/storage/orphan-cleanup.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: NextRequest) => {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";

  try {
    const summary = await sweepOrphanedObjects({ dryRun });

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Storage cleanup failed", error);

    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
};
