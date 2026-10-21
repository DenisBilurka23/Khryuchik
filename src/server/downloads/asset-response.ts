import "server-only";

import { NextResponse } from "next/server";
import {
  getPrivateObject,
  getPublicObject,
  type R2BucketKind,
} from "@/server/storage/r2";
import { buildAttachmentDisposition } from "@/utils";
import type { PurchasedAsset } from "./downloads.service";
import { createFilesWorkerUrl, getFilesWorkerConfig } from "./files-worker";

const NO_STORE = "private, no-store";

export const buildAssetDownloadResponse = async (
  asset: PurchasedAsset,
  bucket: R2BucketKind = "private",
) => {
  const filesWorker = getFilesWorkerConfig();

  if (filesWorker) {
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: await createFilesWorkerUrl(filesWorker, asset, bucket),
        "Cache-Control": NO_STORE,
      },
    });
  }

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

  const headers: Record<string, string> = {
    "Content-Type": contentType,
    "Content-Disposition": buildAttachmentDisposition(asset.fileName),
    "Cache-Control": NO_STORE,
  };

  if (r2Response.ContentLength) {
    headers["Content-Length"] = r2Response.ContentLength.toString();
  }

  return new NextResponse(stream, { headers });
};
