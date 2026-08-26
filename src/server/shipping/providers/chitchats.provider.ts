import "server-only";

import {
  CHITCHATS_DOMESTIC_COUNTRY,
  CHITCHATS_UNKNOWN_CARRIER,
} from "@/constants/chitchats";
import { getUsdRate } from "@/server/localization/exchange-rates.service";
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
  buildQuoteShipmentPayload,
  CHITCHATS_CURRENCY,
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

const describeError = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

const readShipment = async (config: ChitChatsConfig, shipmentId: string) => {
  try {
    return unwrapShipment(
      await chitchatsRequest(config, `/shipments/${shipmentId}`),
    );
  } catch (error) {
    console.error(`Could not re-read Chit Chats shipment ${shipmentId}`, error);

    return null;
  }
};

const toLabelResult = (
  shipmentId: string,
  shipment: ChitChatsShipment | null,
): ShippingLabelResult => {
  const trackingNumber = shipment?.carrier_tracking_code ?? undefined;

  if (!trackingNumber) {
    return {
      status: "bought-unparsed",
      externalId: shipmentId,
      detail: `status=${shipment?.status ?? "unreadable"}`,
    };
  }

  const carrier = shipment?.carrier ?? undefined;
  const amount = Number(shipment?.purchase_amount);

  return {
    status: "bought",
    externalId: shipmentId,
    label: {
      trackingNumber,
      trackingUrl: shipment?.tracking_url ?? undefined,
      carrier: carrier === CHITCHATS_UNKNOWN_CARRIER ? undefined : carrier,
      amount: Number.isFinite(amount) && amount > 0 ? amount : undefined,
      currency: CHITCHATS_CURRENCY,
      labelUrl: shipment?.postage_label_pdf_url ?? undefined,
    },
  };
};

const buyLabel = async (
  request: ShippingLabelRequest,
): Promise<ShippingLabelResult> => {
  const config = getChitChatsConfig();

  if (!config) {
    return { status: "failed", reason: "Chit Chats is not configured" };
  }

  const declaredValue = await toDeclaredValue(request.parcel);

  if (!declaredValue) {
    return {
      status: "failed",
      reason: `No exchange rate to declare a parcel value in ${request.parcel.valueCurrency}`,
    };
  }

  let shipment: ChitChatsShipment | null;

  try {
    shipment = unwrapShipment(
      await chitchatsRequest(config, "/shipments", {
        method: "POST",
        body: buildLabelShipmentPayload({
          parcel: request.parcel,
          declaredValue,
          recipient: request.recipient,
          service: request.service,
          orderId: request.orderId,
        }),
      }),
    );
  } catch (error) {
    return { status: "failed", reason: describeError(error) };
  }

  if (!shipment) {
    return { status: "failed", reason: "Chit Chats returned no shipment" };
  }

  try {
    await chitchatsRequest(config, `/shipments/${shipment.id}/buy`, {
      method: "PATCH",
    });
  } catch (error) {
    const after = await readShipment(config, shipment.id);

    if (after?.carrier_tracking_code) {
      return toLabelResult(shipment.id, after);
    }

    await discardShipment(config, shipment.id);

    return { status: "failed", reason: describeError(error) };
  }

  return toLabelResult(shipment.id, await readShipment(config, shipment.id));
};

export const chitchatsProvider: ShippingProvider = {
  code: "chitchats",
  quote,
  buyLabel,
};
