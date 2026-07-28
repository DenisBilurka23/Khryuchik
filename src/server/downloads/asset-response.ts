import "server-only";

import { NextResponse } from "next/server";
import { getPrivateObject } from "@/server/storage/r2";
import type { PurchasedAsset } from "./downloads.service";

export const buildAssetDownloadResponse = async (asset: PurchasedAsset) => {
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
  const contentType =
    asset.contentType ?? r2Response.ContentType ?? "application/octet-stream";
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
