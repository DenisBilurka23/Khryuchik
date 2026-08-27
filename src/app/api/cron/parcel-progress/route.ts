import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/server/cron/cron-auth";
import { syncParcelProgress } from "@/server/orders/services/delivery.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (request: NextRequest) => {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const summary = await syncParcelProgress();

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Parcel progress sync failed", error);

    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
};
