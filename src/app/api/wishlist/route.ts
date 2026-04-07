import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { getServerAuthSession } from "@/server/auth/config";
import { getRequestCountry } from "@/server/country/request-country";
import {
  addProductToWishlist,
  getResolvedWishlistItems,
  getWishlistIds,
} from "@/server/wishlist/services/wishlist.service";

export const GET = async (request: Request) => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const localeParam = url.searchParams.get("locale");
  const locale = localeParam && isLocale(localeParam) ? localeParam : defaultLocale;
  const country = await getRequestCountry();
  const items = await getResolvedWishlistItems(session.user.id, locale, country);

  return NextResponse.json({ items, ids: items.map((item) => item.productId) });
};

export const POST = async (request: Request) => {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as
    | { productId?: string }
    | null;
  const productId = typeof payload?.productId === "string" ? payload.productId : "";
  const wishlist = await addProductToWishlist(session.user.id, productId);

  return NextResponse.json({ ok: true, ids: getWishlistIds(wishlist) });
};