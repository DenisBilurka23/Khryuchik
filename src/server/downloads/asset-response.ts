import "server-only";

import { NextResponse } from "next/server";
import {
  getPrivateObject,
  getPublicObject,
  type R2BucketKind,
} from "@/server/storage/r2";
import type { PurchasedAsset } from "./downloads.service";

export const buildAssetDownloadResponse = async (
  asset: PurchasedAsset,
  bucket: R2BucketKind = "private",
) => {
  let r2Response;

  try {
    r2Response = await (
      bucket === "public" ? getPublicObject : getPrivateObject
    )(asset.objectKey);
  } catch {
    return NextResponse.json({ error: "storage_error" }, { status: 502 });
  }

  if (!r2Response.Body) {
    return NextResponse.json({ error: "empty_body" }, { status: 502 });
  }

  const stream = r2Response.Body.transformToWebStream();
  const contentType =
    asset.contentType ?? r2Response.ContentType ?? "application/octet-stream";
  const fallbackName = asset.fileName.replace(/[^\x20-\x7E]|["\\]/g, "_");
  const encodedName = encodeURIComponent(asset.fileName).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Disposition": `attachment; filename="${fallbackName}"; filename*=UTF-8''${encodedName}`,
    "Cache-Control": "private, no-store",
  };

  if (r2Response.ContentLength) {
    headers["Content-Length"] = r2Response.ContentLength.toString();
  }

  return new NextResponse(stream, { headers });
};
