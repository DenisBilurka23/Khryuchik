import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { JETPRINT_UPLOAD_CONTENT_TYPES } from "@/constants/jetprint";
import { isLocale } from "@/i18n/config";
import { requireAdminApiAccess } from "@/server/admin/auth";
import {
  createBookFileUploadUrls,
  createProductGalleryUploadUrls,
  createProductJetprintUploadUrls,
  type ProductUploadFileInput,
} from "@/server/storage/r2-assets.service";
import { isR2Configured } from "@/server/storage/r2";

const MAX_FILES_PER_REQUEST = 32;

const ALLOWED_IMAGE_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const ALLOWED_ASSET_CONTENT_TYPES = new Set(["application/pdf"]);

const ALLOWED_JETPRINT_CONTENT_TYPES = new Set(JETPRINT_UPLOAD_CONTENT_TYPES);

const ALLOWED_CONTENT_TYPES_BY_KIND: Record<UploadKind, Set<string>> = {
  gallery: ALLOWED_IMAGE_CONTENT_TYPES,
  asset: ALLOWED_ASSET_CONTENT_TYPES,
  jetprint: ALLOWED_JETPRINT_CONTENT_TYPES,
};

type UploadKind = "gallery" | "asset" | "jetprint";

const isUploadKind = (value: unknown): value is UploadKind =>
  value === "gallery" || value === "asset" || value === "jetprint";

type RequestBody = {
  kind?: UploadKind;
  locale?: string;
  productId?: string;
  files?: Array<{ fileName?: unknown; contentType?: unknown }>;
};

const parseFiles = (
  rawFiles: RequestBody["files"],
  allowedContentTypes: Set<string>,
): ProductUploadFileInput[] | null => {
  if (!Array.isArray(rawFiles) || rawFiles.length === 0) {
    return null;
  }

  const files: ProductUploadFileInput[] = [];

  for (const entry of rawFiles) {
    const fileName =
      typeof entry?.fileName === "string" ? entry.fileName.trim() : "";
    const contentType =
      typeof entry?.contentType === "string" ? entry.contentType.trim() : "";

    if (!fileName || !contentType || !allowedContentTypes.has(contentType)) {
      return null;
    }

    files.push({ fileName, contentType });
  }

  return files;
};

export const POST = async (request: NextRequest) => {
  const session = await requireAdminApiAccess();

  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isR2Configured) {
    return NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
  }

  let body: RequestBody;

  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const kind = isUploadKind(body.kind) ? body.kind : null;
  const locale =
    typeof body.locale === "string" && isLocale(body.locale)
      ? body.locale
      : null;

  if (!kind || !locale) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (!Array.isArray(body.files) || body.files.length > MAX_FILES_PER_REQUEST) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const files = parseFiles(body.files, ALLOWED_CONTENT_TYPES_BY_KIND[kind]);

  if (!files) {
    return NextResponse.json({ error: "invalid_files" }, { status: 400 });
  }

  const productId =
    typeof body.productId === "string" && body.productId.trim()
      ? body.productId.trim()
      : undefined;

  try {
    if (kind === "gallery") {
      const items = await createProductGalleryUploadUrls({
        productId,
        locale,
        files,
      });

      return NextResponse.json({ items });
    }

    if (kind === "jetprint") {
      const items = await createProductJetprintUploadUrls({
        productId,
        files,
      });

      return NextResponse.json({ items });
    }

    const items = await createBookFileUploadUrls({
      productId,
      locale,
      files,
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Admin product upload presign failed", error);

    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
};
