import {
  CHITCHATS_CONTENTS_DESCRIPTION,
  CHITCHATS_DDP_COUNTRIES,
  CHITCHATS_PACKAGE_CONTENTS,
  CHITCHATS_PACKAGE_TYPE,
  CHITCHATS_QUOTE_ORDER_ID,
  CHITCHATS_QUOTE_RECIPIENT_NAME,
  CHITCHATS_UNSET_POSTAGE_TYPE,
} from "@/constants/chitchats";
import { DEFAULT_SHIPPING_ORIGIN_COUNTRY } from "@/constants/shipping";
import type {
  ShippingDestination,
  ShippingLabelRecipient,
  ShippingManufacturer,
  ShippingOption,
  ShippingParcel,
} from "@/types/shipping";
import { type CurrencyCode, roundToCents } from "@/utils";

import type { ChitChatsRate, ChitChatsShipment } from "./chitchats.types";

const CHITCHATS_API_BASE = "https://chitchats.com/api/v1";
const DEFAULT_TIMEOUT_MS = 8_000;

export type ChitChatsConfig = {
  token: string;
  clientId: string;
};

export class ChitChatsApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "ChitChatsApiError";
  }
}

export const getChitChatsConfig = (): ChitChatsConfig | null => {
  const token = process.env.CHITCHATS_ACCESS_TOKEN;
  const clientId = process.env.CHITCHATS_CLIENT_ID;

  if (!token || !clientId) {
    return null;
  }

  return { token, clientId };
};

export type ChitChatsRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  timeoutMs?: number;
};

const parseBody = (raw: string): unknown => {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
};

export const chitchatsRequest = async <TResponse>(
  config: ChitChatsConfig,
  path: string,
  options: ChitChatsRequestOptions = {},
): Promise<TResponse> => {
  const { method = "GET", body, timeoutMs = DEFAULT_TIMEOUT_MS } = options;
  const url = `${CHITCHATS_API_BASE}/clients/${config.clientId}${path}`;

  const response = await fetch(url, {
    method,
    signal: AbortSignal.timeout(timeoutMs),
    headers: {
      Authorization: config.token,
      Accept: "application/json",
      ...(body === undefined
        ? {}
        : { "Content-Type": "application/json;charset=utf-8" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const parsed = parseBody(await response.text());

  if (!response.ok) {
    throw new ChitChatsApiError(
      `Chit Chats ${method} ${path} failed with ${response.status}`,
      response.status,
      parsed,
    );
  }

  return parsed as TResponse;
};

const isChitChatsShipment = (value: unknown): value is ChitChatsShipment => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return typeof (value as Record<string, unknown>).id === "string";
};

export const unwrapShipment = (body: unknown): ChitChatsShipment | null => {
  if (!body || typeof body !== "object") {
    return null;
  }

  const candidate = (body as { shipment?: unknown }).shipment ?? body;

  return isChitChatsShipment(candidate) ? candidate : null;
};

export const unwrapShipments = (body: unknown): ChitChatsShipment[] => {
  if (Array.isArray(body)) {
    return body.filter(isChitChatsShipment);
  }

  if (!body || typeof body !== "object") {
    return [];
  }

  const wrapped = (body as { shipments?: unknown }).shipments;

  return Array.isArray(wrapped) ? wrapped.filter(isChitChatsShipment) : [];
};

export const CHITCHATS_CURRENCY: CurrencyCode = "CAD";

export type ChitChatsDeclaredValue = {
  currency: "cad" | "usd";
  rate: number;
};

type ChitChatsShipmentInput = {
  parcel: ShippingParcel;
  destination: ShippingDestination;
  declaredValue: ChitChatsDeclaredValue;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  postageType: string;
  orderId: string;
};

const toManufacturerFields = (manufacturer?: ShippingManufacturer) => {
  if (
    !manufacturer ||
    Object.values(manufacturer).some((value) => !value?.trim())
  ) {
    return {};
  }

  return {
    manufacturer_contact: manufacturer.name,
    manufacturer_street: manufacturer.street,
    manufacturer_city: manufacturer.city,
    manufacturer_province_code: manufacturer.regionCode,
    manufacturer_postal_code: manufacturer.postalCode,
    manufacturer_country_code: manufacturer.country.toUpperCase(),
  };
};

const buildShipmentPayload = ({
  parcel,
  destination,
  declaredValue,
  recipientName,
  recipientEmail,
  recipientPhone,
  postageType,
  orderId,
}: ChitChatsShipmentInput) => {
  const country = destination.country.toUpperCase();
  const declare = (amount: number) => roundToCents(amount * declaredValue.rate);

  return {
    name: recipientName,
    ...(recipientEmail ? { email: recipientEmail } : {}),
    ...(recipientPhone ? { phone: recipientPhone } : {}),
    address_1: destination.line1 ?? "",
    city: destination.city ?? "",
    ...(destination.region ? { province_code: destination.region } : {}),
    postal_code: destination.postalCode ?? "",
    country_code: country,
    package_contents: CHITCHATS_PACKAGE_CONTENTS,
    description: CHITCHATS_CONTENTS_DESCRIPTION,
    value: declare(parcel.valueAmount),
    value_currency: declaredValue.currency,
    line_items: parcel.contents.map((item) => ({
      quantity: item.quantity,
      description: CHITCHATS_CONTENTS_DESCRIPTION,
      value_amount: declare(item.valueAmount).toFixed(2),
      currency_code: declaredValue.currency,
      hs_tariff_code: item.hsCode ?? null,
      origin_country: item.originCountry ?? DEFAULT_SHIPPING_ORIGIN_COUNTRY,
      ...toManufacturerFields(item.manufacturer),
    })),
    package_type: CHITCHATS_PACKAGE_TYPE,
    weight_unit: "g",
    weight: parcel.weightGrams,
    size_unit: "cm",
    size_x: parcel.lengthMm / 10,
    size_y: parcel.widthMm / 10,
    size_z: parcel.heightMm / 10,
    postage_type: postageType,
    ship_date: "today",
    ...(CHITCHATS_DDP_COUNTRIES.includes(country)
      ? { duties_paid_requested: "yes" }
      : {}),
    order_id: orderId,
  };
};

export const buildQuoteShipmentPayload = ({
  parcel,
  destination,
  declaredValue,
}: {
  parcel: ShippingParcel;
  destination: ShippingDestination;
  declaredValue: ChitChatsDeclaredValue;
}) =>
  buildShipmentPayload({
    parcel,
    destination,
    declaredValue,
    recipientName: CHITCHATS_QUOTE_RECIPIENT_NAME,
    postageType: CHITCHATS_UNSET_POSTAGE_TYPE,
    orderId: CHITCHATS_QUOTE_ORDER_ID,
  });

export const buildLabelShipmentPayload = ({
  parcel,
  declaredValue,
  recipient,
  service,
  orderId,
}: {
  parcel: ShippingParcel;
  declaredValue: ChitChatsDeclaredValue;
  recipient: ShippingLabelRecipient;
  service: string;
  orderId: string;
}) =>
  buildShipmentPayload({
    parcel,
    destination: recipient.destination,
    declaredValue,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    recipientPhone: recipient.phone,
    postageType: service,
    orderId,
  });

export const toShippingOption = (
  rate: ChitChatsRate,
  shipmentId: string,
): ShippingOption | null => {
  const amount = Number(rate.payment_amount);

  if (!Number.isFinite(amount) || amount <= 0) {
    return null;
  }

  return {
    id: `chitchats:${rate.postage_type}`,
    provider: "chitchats",
    service: rate.postage_type,
    amount,
    currency: CHITCHATS_CURRENCY,
    hasTracking: Boolean(rate.tracking_type_description),
    deliveryType: "address",
    transitDays: rate.delivery_time_description ?? undefined,
    externalId: shipmentId,
  };
};
