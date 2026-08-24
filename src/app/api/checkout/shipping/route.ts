import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SHIPPING_QUOTE_RATE_LIMIT } from "@/constants/rate-limit";
import { defaultLocale, isLocale } from "@/i18n/config";
import { resolveCartItems } from "@/server/catalog/services/catalog.service";
import { getRequestCountry } from "@/server/country/request-country";
import {
  consumeRateLimit,
  getClientIpKey,
} from "@/server/rate-limit/rate-limit.service";
import { calculateOrderShipping } from "@/server/orders/services/shipping.service";
import { isStoredCartItem } from "@/types/cart-guards";
import type { ShippingQuoteResponse } from "@/types/order";
import { asOptionalString, isIsoCountryCode } from "@/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const POST = async (request: NextRequest) => {
  const rateLimit = consumeRateLimit({
    key: `shipping-quote:${getClientIpKey(request.headers)}`,
    ...SHIPPING_QUOTE_RATE_LIMIT,
  });

  if (!rateLimit.isAllowed) {
    return NextResponse.json(
      { status: "unavailable" } satisfies ShippingQuoteResponse,
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimit.retryAfterSeconds),
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  }

  const payload = (await request.json().catch(() => null)) as {
    locale?: string;
    items?: unknown[];
    address?: Record<string, unknown>;
    selectedOptionIds?: Record<string, string>;
  } | null;

  const locale =
    payload?.locale && isLocale(payload.locale)
      ? payload.locale
      : defaultLocale;
  const items = Array.isArray(payload?.items)
    ? payload.items.filter(isStoredCartItem)
    : [];
  const addressCountry = asOptionalString(payload?.address?.country);
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
    items: resolved.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      selections: selectionsById.get(item.id),
      isDigital: item.isDigital ?? false,
      unitPrice: item.price,
    })),
    subtotal,
    selectedOptionIds: payload?.selectedOptionIds,
    address: {
      country: addressCountry,
      region: asOptionalString(payload?.address?.region),
      city: asOptionalString(payload?.address?.city),
      postalCode: asOptionalString(payload?.address?.postalCode),
      line1: asOptionalString(payload?.address?.line1),
    },
  });

  return respond(result);
};
