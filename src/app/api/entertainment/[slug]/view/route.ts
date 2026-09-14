import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ENTERTAINMENT_VIEW_RATE_LIMIT } from "@/constants/rate-limit";
import { registerEntertainmentItemView } from "@/server/entertainment/services/entertainment.service";
import {
  consumeRateLimit,
  getClientIpKey,
} from "@/server/rate-limit/rate-limit.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type EntertainmentViewRouteProps = {
  params: Promise<{ slug: string }>;
};

export const POST = async (
  request: NextRequest,
  { params }: EntertainmentViewRouteProps,
) => {
  const rateLimit = consumeRateLimit({
    key: `entertainment-view:${getClientIpKey(request.headers)}`,
    ...ENTERTAINMENT_VIEW_RATE_LIMIT,
  });

  if (!rateLimit.isAllowed) {
    return NextResponse.json(
      { ok: false },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }

  const { slug } = await params;

  try {
    const isCounted = await registerEntertainmentItemView(slug);

    return NextResponse.json(
      { ok: isCounted },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    console.error("POST /api/entertainment/[slug]/view failed", error);

    return NextResponse.json({ ok: false }, { status: 500 });
  }
};
