import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import {
  getWishlistIds,
  mergeWishlistEntries,
} from "@/server/wishlist/services/wishlist.service";

export const POST = async (request: Request) => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { productIds?: string[] }
    | null;
  const productIds = Array.isArray(payload?.productIds) ? payload.productIds : [];
  const wishlist = await mergeWishlistEntries(session.user.id, productIds);

  return NextResponse.json({ ok: true, ids: getWishlistIds(wishlist) });
};