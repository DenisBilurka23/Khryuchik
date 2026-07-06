import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { requireAccountApiAccess } from "@/server/auth/page-context";
import {
  findPurchasedAsset,
} from "@/server/downloads/downloads.service";
import { getPrivateObject } from "@/server/storage/r2";

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
  const asset = await findPurchasedAsset(access.user.id, access.user.email, assetId);

  if (!asset) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let r2Response;
  try {
    r2Response = await getPrivateObject(asset.objectKey);
  } catch {
    return NextResponse.json({ error: "storage_error" }, { status: 502 });
  }

  if (!r2Response.Body) {
    return NextResponse.json({ error: "empty_body" }, { status: 502 });
  }

  const stream = r2Response.Body.transformToWebStream();
  const contentType = asset.contentType ?? r2Response.ContentType ?? "application/octet-stream";
  const encodedName = encodeURIComponent(asset.fileName);

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${asset.fileName}"; filename*=UTF-8''${encodedName}`,
    "Cache-Control": "private, no-store",
  };

  if (r2Response.ContentLength) {
    headers["Content-Length"] = r2Response.ContentLength.toString();
  }

  return new NextResponse(stream, { headers });
};
