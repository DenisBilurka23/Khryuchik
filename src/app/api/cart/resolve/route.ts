import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { getRequestCountry } from "@/server/country/request-country";
import { resolveCartItems } from "@/server/catalog/services/catalog.service";
import { isStoredCartItem } from "@/types/cart-guards";

export const dynamic = "force-dynamic";

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as
    | { locale?: string; items?: unknown[] }
    | null;
  const locale = payload?.locale && isLocale(payload.locale)
    ? payload.locale
    : defaultLocale;
  const items = Array.isArray(payload?.items)
    ? payload.items.filter(isStoredCartItem)
    : [];
  const country = await getRequestCountry();
  const resolvedItems = await resolveCartItems(locale, country, items);
  const response = NextResponse.json({ items: resolvedItems });

  response.headers.set("Cache-Control", "no-store, max-age=0");

  return response;
};