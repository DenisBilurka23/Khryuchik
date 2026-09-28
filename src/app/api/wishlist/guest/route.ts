import { NextResponse } from "next/server";

import { getRequestRegion } from "@/server/region/request-region";
import { resolveGuestWishlistItems } from "@/server/wishlist/services/wishlist.service";

export const POST = async (request: Request) => {
  const payload = (await request.json().catch(() => null)) as {
    locale?: string;
    items?: Array<{ productId?: string; addedAt?: string }>;
  } | null;
  const region = await getRequestRegion();
  const items = await resolveGuestWishlistItems(
    payload?.locale ?? null,
    region,
    Array.isArray(payload?.items) ? payload.items : [],
  );

  return NextResponse.json({ items, ids: items.map((item) => item.productId) });
};
