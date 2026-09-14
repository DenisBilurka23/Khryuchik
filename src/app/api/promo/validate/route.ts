import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { validatePromoCode } from "@/server/promo/services/promo-codes.service";
import type { PromoValidation } from "@/types/promo";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as
    | { code?: string }
    | null;
  const code = typeof payload?.code === "string" ? payload.code : "";
  const validation: PromoValidation = await validatePromoCode(code);
  const response = NextResponse.json(validation);

  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
};
