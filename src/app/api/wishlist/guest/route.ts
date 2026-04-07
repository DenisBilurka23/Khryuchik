import { NextResponse } from "next/server";

import { getRequestCountry } from "@/server/country/request-country";
import { resolveGuestWishlistItems } from "@/server/wishlist/services/wishlist.service";

export const POST = async (request: Request) => {
  const payload = (await request.json().catch(() => null)) as
    | { locale?: string; items?: Array<{ productId?: string; addedAt?: string }> }
    | null;
  const country = await getRequestCountry();
  const items = await resolveGuestWishlistItems(
    payload?.locale ?? null,
    country,
    Array.isArray(payload?.items) ? payload.items : [],
  );

  return NextResponse.json({ items, ids: items.map((item) => item.productId) });
};