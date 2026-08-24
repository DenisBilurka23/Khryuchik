import "server-only";

import { CHITCHATS_DOMESTIC_COUNTRY } from "@/constants/chitchats";
import { getUsdRate } from "@/server/localization/exchange-rates.service";
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
  buildQuoteShipmentPayload,
  type ChitChatsConfig,
  type ChitChatsDeclaredValue,
  chitchatsRequest,
  getChitChatsConfig,
  toShippingOption,
  unwrapShipment,
} from "./chitchats.client";
import type { ChitChatsShipment } from "./chitchats.types";

const QUOTE_CACHE_TTL_MS = 10 * 60 * 1000;
const FAILED_QUOTE_CACHE_TTL_MS = 60 * 1000;

const buildCacheKey = (
  parcel: ShippingParcel,
  destination: ShippingDestination,
) =>
  [
    "chitchats",
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

const toDeclaredValue = async (
  parcel: ShippingParcel,
): Promise<ChitChatsDeclaredValue | null> => {
  if (parcel.valueCurrency === "CAD") {
    return { currency: "cad", rate: 1 };
  }

  if (parcel.valueCurrency === "USD") {
    return { currency: "usd", rate: 1 };
  }

  const fromUsdRate = await getUsdRate(parcel.valueCurrency);

  if (fromUsdRate === null || fromUsdRate === 0) {
    return null;
  }

  return { currency: "usd", rate: 1 / fromUsdRate };
};

const discardShipment = async (config: ChitChatsConfig, shipmentId: string) => {
  try {
    await chitchatsRequest(config, `/shipments/${shipmentId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Chit Chats shipment cleanup failed", error);
  }
};

const hasCustomsCodes = (parcel: ShippingParcel, destinationCountry: string) =>
  destinationCountry === CHITCHATS_DOMESTIC_COUNTRY ||
  parcel.contents.every((item) => Boolean(item.hsCode));

const createQuoteShipment = async (
  config: ChitChatsConfig,
  parcel: ShippingParcel,
  destination: ShippingDestination,
): Promise<ChitChatsShipment | null> => {
  const country = destination.country.toUpperCase();

  if (!hasCustomsCodes(parcel, country)) {
    console.error(
      `Cannot quote a ${country} parcel: a customs line has no HS tariff code`,
    );

    return null;
  }

  const declaredValue = await toDeclaredValue(parcel);

  if (!declaredValue) {
    console.error(
      `No exchange rate to declare a parcel value in ${parcel.valueCurrency}`,
    );

    return null;
  }

  try {
    const response = await chitchatsRequest(config, "/shipments", {
      method: "POST",
      body: buildQuoteShipmentPayload({ parcel, destination, declaredValue }),
    });

    return unwrapShipment(response);
  } catch (error) {
    console.error("Chit Chats shipment creation failed", error);

    return null;
  }
};

const quote = async (
  parcel: ShippingParcel,
  destination: ShippingDestination,
): Promise<ShippingQuote> => {
  const config = getChitChatsConfig();

  if (!config) {
    console.error(
      "CHITCHATS_ACCESS_TOKEN or CHITCHATS_CLIENT_ID is not set; cannot quote",
    );

    return { status: "unavailable" };
  }

  const cacheKey = buildCacheKey(parcel, destination);
  const cached = await findCachedShippingQuote(cacheKey);

  if (cached) {
    return cached;
  }

  const shipment = await createQuoteShipment(config, parcel, destination);

  if (!shipment) {
    const failure: ShippingQuote = { status: "unavailable" };

    await saveCachedShippingQuote(cacheKey, failure, FAILED_QUOTE_CACHE_TTL_MS);

    return failure;
  }

  const options = (shipment.rates ?? [])
    .map((rate) => toShippingOption(rate, shipment.id))
    .filter((option): option is ShippingOption => option !== null);

  if (options.length === 0) {
    await discardShipment(config, shipment.id);

    const failure: ShippingQuote = { status: "unsupported-destination" };

    await saveCachedShippingQuote(cacheKey, failure, FAILED_QUOTE_CACHE_TTL_MS);

    return failure;
  }

  const result: ShippingQuote = { status: "quoted", options };

  await saveCachedShippingQuote(cacheKey, result, QUOTE_CACHE_TTL_MS);

  return result;
};

export const chitchatsProvider: ShippingProvider = { code: "chitchats", quote };
