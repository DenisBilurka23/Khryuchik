import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { buildAssetDownloadResponse } from "@/server/downloads/asset-response";
import { findOrderAssetByToken } from "@/server/downloads/order-downloads.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> },
) => {
  const token = request.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { assetId } = await params;
  const asset = await findOrderAssetByToken(token, assetId);

  if (!asset) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return buildAssetDownloadResponse(asset);
};
