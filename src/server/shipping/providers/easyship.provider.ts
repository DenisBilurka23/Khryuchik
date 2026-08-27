import "server-only";

import { EASYSHIP_SKIPPED_DESTINATIONS } from "@/constants/easyship";

import type {
  ShippingDestination,
  ShippingLabelRequest,
  ShippingLabelResult,
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
  buildLabelShipmentPayload,
  buildRatesPayload,
  EasyshipApiError,
  easyshipRequest,
  getEasyshipConfig,
  toShipmentLabel,
  toShippingOption,
  unwrapRates,
} from "./easyship.client";
import type {
  EasyshipErrorBody,
  EasyshipRatesResponse,
  EasyshipShipmentResponse,
} from "./easyship.types";

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

// Buying postage takes longer than asking for a price, and the request must not
// be abandoned while the carrier is already charging for it.
const LABEL_TIMEOUT_MS = 30_000;

const describeError = (error: unknown) => {
  if (!(error instanceof EasyshipApiError)) {
    return error instanceof Error ? error.message : String(error);
  }

  const body = error.body as EasyshipErrorBody | undefined;
  const reason = body?.error?.details?.join("; ") ?? body?.error?.message;
  const requestId = body?.error?.request_id;

  return (
    [reason, requestId ? `request ${requestId}` : undefined]
      .filter(Boolean)
      .join(" · ") || error.message
  );
};

const buyLabel = async (
  request: ShippingLabelRequest,
): Promise<ShippingLabelResult> => {
  const config = getEasyshipConfig();

  if (!config) {
    return {
      status: "failed",
      reason: "EASYSHIP_API_TOKEN or the EASYSHIP_ORIGIN_* address is not set",
    };
  }

  let response: EasyshipShipmentResponse;

  try {
    response = await easyshipRequest<EasyshipShipmentResponse>(
      config,
      "/shipments",
      buildLabelShipmentPayload(config, request),
      LABEL_TIMEOUT_MS,
    );
  } catch (error) {
    console.error("Easyship label purchase failed", error);

    return { status: "failed", reason: describeError(error) };
  }

  const { externalId, label } = toShipmentLabel(response);

  if (!externalId) {
    return {
      status: "failed",
      reason: "Easyship returned no shipment id",
    };
  }

  if (!label.trackingNumber) {
    return {
      status: "bought-unparsed",
      externalId,
      detail: "shipment created without a tracking number in the response",
    };
  }

  return { status: "bought", label, externalId };
};

export const easyshipProvider: ShippingProvider = {
  code: "easyship",
  supports: (destination) =>
    getEasyshipConfig() !== null &&
    !EASYSHIP_SKIPPED_DESTINATIONS.includes(destination.country.toUpperCase()),
  quote,
  buyLabel,
};
