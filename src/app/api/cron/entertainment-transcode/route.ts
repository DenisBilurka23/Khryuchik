import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isCronAuthorized } from "@/server/cron/cron-auth";
import {
  applyEntertainmentTranscodeResult,
  getEntertainmentTranscodeJob,
  getEntertainmentTranscodeQueue,
} from "@/server/entertainment/services/entertainment-transcode.service";
import { isR2Configured } from "@/server/storage/r2";
import type { EntertainmentTranscodeOutcome } from "@/types/entertainment";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FAILURE_REASON_MAX_LENGTH = 500;

type ResultBody = {
  slug?: unknown;
  sourceObjectKey?: unknown;
  status?: unknown;
  failureReason?: unknown;
};

const parseOutcome = (value: unknown): EntertainmentTranscodeOutcome | null =>
  value === "ready" || value === "failed" ? value : null;

export const GET = async (request: NextRequest) => {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!isR2Configured) {
    return NextResponse.json({ error: "storage_unavailable" }, { status: 503 });
  }

  const slug = request.nextUrl.searchParams.get("slug")?.trim();

  try {
    if (!slug) {
      return NextResponse.json({
        queue: await getEntertainmentTranscodeQueue(),
      });
    }

    const job = await getEntertainmentTranscodeJob(slug);

    if (!job) {
      return NextResponse.json({ error: "not_pending" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error("Entertainment transcode job lookup failed", error);

    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
};

export const POST = async (request: NextRequest) => {
  if (!isCronAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let body: ResultBody;

  try {
    body = (await request.json()) as ResultBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const slug = typeof body.slug === "string" ? body.slug.trim() : "";
  const sourceObjectKey =
    typeof body.sourceObjectKey === "string" ? body.sourceObjectKey.trim() : "";
  const status = parseOutcome(body.status);

  if (!slug || !sourceObjectKey || !status) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const failureReason =
    status === "failed" && typeof body.failureReason === "string"
      ? body.failureReason.trim().slice(0, FAILURE_REASON_MAX_LENGTH) ||
        undefined
      : undefined;

  try {
    const applied = await applyEntertainmentTranscodeResult({
      slug,
      sourceObjectKey,
      status,
      failureReason,
    });

    return NextResponse.json({ slug, status, applied });
  } catch (error) {
    console.error("Entertainment transcode callback failed", error);

    return NextResponse.json({ error: "unexpected_error" }, { status: 500 });
  }
};
