import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  ENTERTAINMENT_DOWNLOAD_CONTENT_TYPES,
  ENTERTAINMENT_DOWNLOAD_MAX_BYTES,
  ENTERTAINMENT_POSTER_CONTENT_TYPES,
  ENTERTAINMENT_POSTER_MAX_BYTES,
  ENTERTAINMENT_VIDEO_CONTENT_TYPES,
  ENTERTAINMENT_VIDEO_MAX_BYTES,
} from "@/constants/entertainment";
import { isLocale } from "@/i18n/config";
import { requireAdminApiAccess } from "@/server/admin/auth";
import { isR2Configured } from "@/server/storage/r2";
import {
  createEntertainmentUploadUrl,
  type EntertainmentUploadKind,
} from "@/server/storage/r2-assets.service";

const UPLOAD_RULES: Record<
  EntertainmentUploadKind,
  { contentTypes: string[]; maxBytes: number }
> = {
  video: {
    contentTypes: ENTERTAINMENT_VIDEO_CONTENT_TYPES,
    maxBytes: ENTERTAINMENT_VIDEO_MAX_BYTES,
  },
  poster: {
    contentTypes: ENTERTAINMENT_POSTER_CONTENT_TYPES,
    maxBytes: ENTERTAINMENT_POSTER_MAX_BYTES,
  },
  download: {
    contentTypes: ENTERTAINMENT_DOWNLOAD_CONTENT_TYPES,
    maxBytes: ENTERTAINMENT_DOWNLOAD_MAX_BYTES,
  },
};

type RequestBody = {
  kind?: string;
  slug?: string;
  locale?: string;
  file?: { fileName?: unknown; contentType?: unknown; sizeBytes?: unknown };
};

const parseUploadKind = (value: unknown): EntertainmentUploadKind | null =>
  value === "video" || value === "poster" || value === "download"
    ? value
    : null;

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

  const kind = parseUploadKind(body.kind);

  if (!kind) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const fileName =
    typeof body.file?.fileName === "string" ? body.file.fileName.trim() : "";
  const contentType =
    typeof body.file?.contentType === "string"
      ? body.file.contentType.trim()
      : "";
  const sizeBytes =
    typeof body.file?.sizeBytes === "number" ? body.file.sizeBytes : 0;
  const rules = UPLOAD_RULES[kind];

  if (!fileName || !rules.contentTypes.includes(contentType)) {
    return NextResponse.json({ error: "invalid_file_type" }, { status: 400 });
  }

  if (sizeBytes <= 0 || sizeBytes > rules.maxBytes) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  const slug =
    typeof body.slug === "string" && body.slug.trim()
      ? body.slug.trim()
      : undefined;
  const locale =
    typeof body.locale === "string" && isLocale(body.locale)
      ? body.locale
      : undefined;

  try {
    const item = await createEntertainmentUploadUrl({
      kind,
      slug,
      locale,
      file: { fileName, contentType },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Admin entertainment upload presign failed", error);

    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
};
