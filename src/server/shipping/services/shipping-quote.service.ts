import "server-only";

import { getUsdRate } from "@/server/localization/exchange-rates.service";
import type {
  ShippingDestination,
  ShippingHubCode,
  ShippingOption,
  ShippingParcel,
  ShippingQuote,
} from "@/types/shipping";
import { SHIPPING_REQUIRES_TRACKING } from "@/constants/shipping";
import { convertShippingAmount, type CurrencyCode } from "@/utils";

import { PROVIDERS_BY_HUB } from "../providers/registry";
import { dropDominatedOptions } from "../utils";

const toTargetCurrency = async (
  options: ShippingOption[],
  targetCurrency: CurrencyCode,
): Promise<ShippingOption[]> => {
  const converted: ShippingOption[] = [];
  const rates = new Map<CurrencyCode, number | null>();

  const rateFor = async (currency: CurrencyCode) => {
    if (!rates.has(currency)) {
      rates.set(currency, await getUsdRate(currency));
    }

    return rates.get(currency) ?? null;
  };

  for (const option of options) {
    if (option.currency === targetCurrency) {
      converted.push(option);
      continue;
    }

    const [fromUsdRate, toUsdRate] = await Promise.all([
      rateFor(option.currency),
      rateFor(targetCurrency),
    ]);

    if (fromUsdRate === null || toUsdRate === null) {
      console.error(
        `No exchange rate to price ${option.id} in ${targetCurrency}`,
      );
      continue;
    }

    converted.push({
      ...option,
      amount: convertShippingAmount({
        amount: option.amount,
        fromCurrency: option.currency,
        toCurrency: targetCurrency,
        fromUsdRate,
        toUsdRate,
      }),
      currency: targetCurrency,
    });
  }

  return converted;
};

export type ShipmentQuoteInput = {
  hubs: ShippingHubCode[];
  parcel: ShippingParcel;
  destination: ShippingDestination;
  currency: CurrencyCode;
};

export const quoteShipment = async ({
  hubs,
  parcel,
  destination,
  currency,
}: ShipmentQuoteInput): Promise<ShippingQuote> => {
  const providers = hubs
    .flatMap((hub) => PROVIDERS_BY_HUB[hub])
    .filter((provider) => provider.supports?.(destination) ?? true);

  if (providers.length === 0) {
    return { status: "unsupported-destination" };
  }

  const results = await Promise.allSettled(
    providers.map((provider) => provider.quote(parcel, destination)),
  );

  const quotes = results.flatMap((result) => {
    if (result.status === "rejected") {
      console.error("Shipping provider threw while quoting", result.reason);

      return [];
    }

    return [result.value];
  });

  const quotedOptions = quotes.flatMap((quote) =>
    quote.status === "quoted" ? quote.options : [],
  );

  const options = SHIPPING_REQUIRES_TRACKING
    ? quotedOptions.filter((option) => option.hasTracking)
    : quotedOptions;

  if (options.length === 0) {
    if (quotes.some((quote) => quote.status === "unsupported-parcel")) {
      return { status: "unsupported-parcel" };
    }

    if (quotes.every((quote) => quote.status === "unsupported-destination")) {
      return { status: "unsupported-destination" };
    }

    return { status: "unavailable" };
  }

  const priced = await toTargetCurrency(options, currency);

  if (priced.length === 0) {
    return { status: "unavailable" };
  }

  return {
    status: "quoted",
    options: dropDominatedOptions(priced).sort((a, b) => a.amount - b.amount),
  };
};
