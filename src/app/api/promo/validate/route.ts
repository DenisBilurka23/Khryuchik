import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { PROMO_RATE_LIMIT } from "@/constants/rate-limit";
import { getServerAuthSession } from "@/server/auth/config";
import {
  consumeRateLimit,
  getClientIpKey,
} from "@/server/rate-limit/rate-limit.service";
import { validatePromoCode } from "@/server/promo/services/promo-codes.service";
import type { PromoValidation } from "@/types/promo";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  const rateLimit = await consumeRateLimit({
    key: `promo-validate:${getClientIpKey(request.headers)}`,
    ...PROMO_RATE_LIMIT,
  });

  if (!rateLimit.isAllowed) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: { "Retry-After": String(rateLimit.retryAfterSeconds) },
      },
    );
  }

  const payload = (await request.json().catch(() => null)) as {
    code?: string;
  } | null;
  const code = typeof payload?.code === "string" ? payload.code : "";
  const session = await getServerAuthSession();
  const validation: PromoValidation = await validatePromoCode(
    code,
    session?.user?.id || undefined,
  );
  const response = NextResponse.json(validation);

  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
};
