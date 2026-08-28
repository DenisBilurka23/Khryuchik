import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SHIPPING_QUOTE_RATE_LIMIT } from "@/constants/rate-limit";
import {
  consumeRateLimit,
  getClientIpKey,
} from "@/server/rate-limit/rate-limit.service";
import { findPickupPoints } from "@/server/shipping/services/pickup-points.service";
import type { PickupPointsResponse } from "@/types/order";
import { asOptionalString, isIsoCountryCode } from "@/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = async (request: NextRequest) => {
  const rateLimit = consumeRateLimit({
    key: `pickup-points:${getClientIpKey(request.headers)}`,
    ...SHIPPING_QUOTE_RATE_LIMIT,
  });

  if (!rateLimit.isAllowed) {
    return NextResponse.json({ points: [] } satisfies PickupPointsResponse, {
      status: 429,
      headers: {
        "Retry-After": String(rateLimit.retryAfterSeconds),
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }

  const payload = (await request.json().catch(() => null)) as {
    address?: Record<string, unknown>;
  } | null;

  const country = asOptionalString(payload?.address?.country);

  const respond = (body: PickupPointsResponse) => {
    const response = NextResponse.json(body);

    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  };

  if (!country || !isIsoCountryCode(country)) {
    return respond({ points: [] });
  }

  const points = await findPickupPoints({
    country,
    region: asOptionalString(payload?.address?.region),
    city: asOptionalString(payload?.address?.city),
    postalCode: asOptionalString(payload?.address?.postalCode),
    line1: asOptionalString(payload?.address?.line1),
  });

  return respond({ points });
};
