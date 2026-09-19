import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAccountApiAccess } from "@/server/auth/page-context";
import { buildAssetDownloadResponse } from "@/server/downloads/asset-response";
import { findPurchasedAsset } from "@/server/downloads/downloads.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const GET = async (
  _request: NextRequest,
  { params }: { params: Promise<{ assetId: string }> },
) => {
  const access = await requireAccountApiAccess();

  if (!access) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { assetId } = await params;
  const asset = await findPurchasedAsset(
    access.user.id,
    access.user.email,
    assetId,
  );

  if (!asset) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return buildAssetDownloadResponse(asset);
};
