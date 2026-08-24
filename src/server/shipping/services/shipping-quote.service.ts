import "server-only";

import { getUsdRate } from "@/server/localization/exchange-rates.service";
import type { ShippingHubCode } from "@/types/shipping";
import type {
  ShippingDestination,
  ShippingOption,
  ShippingParcel,
  ShippingQuote,
} from "@/types/shipping";
import { SHIPPING_REQUIRES_TRACKING } from "@/constants/shipping";
import { convertShippingAmount, type CurrencyCode } from "@/utils";

import { bpostProvider } from "../providers/bpost.provider";
import { chitchatsProvider } from "../providers/chitchats.provider";
import type { ShippingProvider } from "../types";
import { dropDominatedOptions } from "../utils";

const PROVIDERS_BY_HUB: Record<ShippingHubCode, ShippingProvider[]> = {
  europe: [bpostProvider],
  northAmerica: [chitchatsProvider],
};

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
  // More than one when the destination is served equally well from either
  // warehouse: every provider behind every listed hub is asked, and the
  // dominance filter below settles it on price rather than on geography.
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

  // One slow or broken carrier must not take the whole checkout down: the
  // table providers answer instantly and carry the quote on their own.
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

  // Applied before the empty check on purpose. No zone is served by untracked
  // services alone today, so this cannot strand a destination; if one ever
  // were, reporting it as unserved is the honest answer rather than quietly
  // selling a parcel nobody can trace.
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
