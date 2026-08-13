import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";
import { resolveCartItems } from "@/server/catalog/services/catalog.service";
import { getRequestCountry } from "@/server/country/request-country";
import { calculateOrderShipping } from "@/server/orders/services/shipping.service";
import { isStoredCartItem } from "@/types/cart-guards";
import type { ShippingQuoteResponse } from "@/types/order";
import { isIsoCountryCode } from "@/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const optionalString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;

export const POST = async (request: NextRequest) => {
  const payload = (await request.json().catch(() => null)) as {
    locale?: string;
    items?: unknown[];
    address?: Record<string, unknown>;
  } | null;

  const locale =
    payload?.locale && isLocale(payload.locale)
      ? payload.locale
      : defaultLocale;
  const items = Array.isArray(payload?.items)
    ? payload.items.filter(isStoredCartItem)
    : [];
  const addressCountry = optionalString(payload?.address?.country);
  const country = await getRequestCountry();

  const respond = (body: ShippingQuoteResponse) => {
    const response = NextResponse.json(body);

    response.headers.set("Cache-Control", "no-store, max-age=0");

    return response;
  };

  if (
    items.length === 0 ||
    !addressCountry ||
    !isIsoCountryCode(addressCountry)
  ) {
    return respond({ status: "unavailable" });
  }

  const { items: resolved, isPricingUnavailable } = await resolveCartItems(
    locale,
    country,
    items,
  );

  if (isPricingUnavailable) {
    return respond({ status: "unavailable" });
  }

  const subtotal = resolved.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const selectionsById = new Map(
    items.map((item) => [item.id, item.selections]),
  );

  const result = await calculateOrderShipping({
    country,
    // Only resolved lines are quoted, so the preview matches what the order
    // will charge for.
    items: resolved.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selections: selectionsById.get(item.id),
    })),
    subtotal,
    isDigitalOnly:
      resolved.length > 0 && resolved.every((item) => item.isDigital),
    address: {
      country: addressCountry,
      region: optionalString(payload?.address?.region),
      city: optionalString(payload?.address?.city),
      postalCode: optionalString(payload?.address?.postalCode),
      line1: optionalString(payload?.address?.line1),
    },
  });

  return respond(result);
};
