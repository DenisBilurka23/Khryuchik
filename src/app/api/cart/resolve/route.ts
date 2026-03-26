import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { getRequestCountry } from "@/lib/request-country";
import { resolveCartItems } from "@/server/catalog/services/catalog.service";
import type { StoredCartItem } from "@/types/cart";

export const dynamic = "force-dynamic";

const isCartSelections = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.values(value as Record<string, unknown>).every(
    (entry) => typeof entry === "string" || typeof entry === "undefined",
  );
};

const isStoredCartItem = (value: unknown): value is StoredCartItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.productId === "string" &&
    typeof item.quantity === "number" &&
    (typeof item.selections === "undefined" || isCartSelections(item.selections))
  );
};

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