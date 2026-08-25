import "server-only";

import { EASYSHIP_SKIPPED_DESTINATIONS } from "@/constants/easyship";

import type {
  ShippingDestination,
  ShippingOption,
  ShippingParcel,
  ShippingQuote,
} from "@/types/shipping";

import {
  findCachedShippingQuote,
  saveCachedShippingQuote,
} from "../repositories/shipping-quote-cache.repository";
import type { ShippingProvider } from "../types";
import {
  buildRatesPayload,
  EasyshipApiError,
  easyshipRequest,
  getEasyshipConfig,
  toShippingOption,
  unwrapRates,
} from "./easyship.client";
import type { EasyshipRatesResponse } from "./easyship.types";

const QUOTE_CACHE_TTL_MS = 30 * 60 * 1000;
const FAILED_QUOTE_CACHE_TTL_MS = 60 * 1000;

const buildCacheKey = (
  parcel: ShippingParcel,
  destination: ShippingDestination,
) =>
  [
    "easyship",
    destination.country,
    destination.region ?? "",
    destination.postalCode ?? "",
    parcel.weightGrams,
    parcel.lengthMm,
    parcel.widthMm,
    parcel.heightMm,
    parcel.valueAmount,
    parcel.valueCurrency,
  ]
    .join("|")
    .toUpperCase();

const quote = async (
  parcel: ShippingParcel,
  destination: ShippingDestination,
): Promise<ShippingQuote> => {
  const config = getEasyshipConfig();

  if (!config) {
    return { status: "unavailable" };
  }

  const cacheKey = buildCacheKey(parcel, destination);
  const cached = await findCachedShippingQuote(cacheKey);

  if (cached) {
    return cached;
  }

  let options: ShippingOption[] = [];

  try {
    const response = await easyshipRequest<EasyshipRatesResponse>(
      config,
      "/rates",
      buildRatesPayload(config, parcel, destination),
    );

    options = unwrapRates(response)
      .map(toShippingOption)
      .filter((option): option is ShippingOption => option !== null);
  } catch (error) {
    const isUnserved =
      error instanceof EasyshipApiError && error.status === 422;

    if (!isUnserved) {
      console.error("Easyship rate request failed", error);
    }

    const failure: ShippingQuote = {
      status: isUnserved ? "unsupported-destination" : "unavailable",
    };

    await saveCachedShippingQuote(cacheKey, failure, FAILED_QUOTE_CACHE_TTL_MS);

    return failure;
  }

  if (options.length === 0) {
    const failure: ShippingQuote = { status: "unsupported-destination" };

    await saveCachedShippingQuote(cacheKey, failure, FAILED_QUOTE_CACHE_TTL_MS);

    return failure;
  }

  const result: ShippingQuote = { status: "quoted", options };

  await saveCachedShippingQuote(cacheKey, result, QUOTE_CACHE_TTL_MS);

  return result;
};

export const easyshipProvider: ShippingProvider = {
  code: "easyship",
  supports: (destination) =>
    getEasyshipConfig() !== null &&
    !EASYSHIP_SKIPPED_DESTINATIONS.includes(destination.country.toUpperCase()),
  quote,
};
