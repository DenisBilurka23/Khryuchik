import "server-only";

import { getRegionPricing } from "@/server/localization/localization.service";
import {
  getPrintifyShippingQuote,
  type ShippingQuoteAddress,
  type ShippingQuoteItem,
} from "@/server/printify/services/printify-shipping.service";
import type { CountryCode } from "@/utils";
import { convertFromUsd } from "@/utils";

export type OrderShippingInput = {
  country: CountryCode;
  items: ShippingQuoteItem[];
  subtotal: number;
  isDigitalOnly: boolean;
  address?: ShippingQuoteAddress;
};

export type OrderShippingResult =
  | { status: "ok"; shipping: number }
  | { status: "unsupported-destination" }
  | { status: "unsupported-variant" }
  | { status: "unavailable" };

export const calculateOrderShipping = async ({
  country,
  items,
  subtotal,
  isDigitalOnly,
  address,
}: OrderShippingInput): Promise<OrderShippingResult> => {
  if (isDigitalOnly || subtotal === 0) {
    return { status: "ok", shipping: 0 };
  }

  const quote = await getPrintifyShippingQuote(items, {
    ...address,
    country: address?.country ?? country,
  });

  if (quote.status === "unavailable") {
    return { status: "unavailable" };
  }

  if (quote.status === "unsupported-destination") {
    return { status: "unsupported-destination" };
  }

  if (quote.status === "unsupported-variant") {
    return { status: "unsupported-variant" };
  }

  if (quote.status === "no-merch") {
    return { status: "ok", shipping: 0 };
  }

  const regionPricing = await getRegionPricing(country);

  if (regionPricing.status === "unavailable") {
    return { status: "unavailable" };
  }

  const amountUsd = quote.amountCents / 100;

  return {
    status: "ok",
    shipping:
      regionPricing.status === "converted"
        ? convertFromUsd(amountUsd, regionPricing.conversion.rate)
        : amountUsd,
  };
};
