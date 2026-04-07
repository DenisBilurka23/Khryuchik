import { NextResponse } from "next/server";

import { getServerAuthSession } from "@/server/auth/config";
import {
  getWishlistIds,
  removeProductFromWishlist,
} from "@/server/wishlist/services/wishlist.service";

type WishlistProductRouteProps = {
  params: Promise<{ productId: string }>;
};

export const DELETE = async (
  _request: Request,
  { params }: WishlistProductRouteProps,
) => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { productId } = await params;
  const wishlist = await removeProductFromWishlist(session.user.id, productId);

  return NextResponse.json({ ok: true, ids: getWishlistIds(wishlist) });
};