import {
  EASYSHIP_API_BASE,
  EASYSHIP_CONTENTS_DESCRIPTION,
  EASYSHIP_HAS_TRACKING,
  EASYSHIP_SANDBOX_API_BASE,
  EASYSHIP_SANDBOX_TOKEN_PREFIX,
  EASYSHIP_TIMEOUT_MS,
} from "@/constants/easyship";
import { DEFAULT_SHIPPING_ORIGIN_COUNTRY } from "@/constants/shipping";
import type {
  ShippingDestination,
  ShippingOption,
  ShippingParcel,
} from "@/types/shipping";
import type { CurrencyCode } from "@/utils";

import type { EasyshipRate, EasyshipRatesResponse } from "./easyship.types";

export type EasyshipOriginAddress = {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
};

export type EasyshipConfig = {
  token: string;
  origin: EasyshipOriginAddress;
};

export class EasyshipApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body?: unknown,
  ) {
    super(message);
    this.name = "EasyshipApiError";
  }
}

export const getEasyshipConfig = (): EasyshipConfig | null => {
  const token = process.env.EASYSHIP_API_TOKEN;
  const line1 = process.env.EASYSHIP_ORIGIN_LINE1;
  const city = process.env.EASYSHIP_ORIGIN_CITY;
  const postalCode = process.env.EASYSHIP_ORIGIN_POSTAL_CODE;
  const country = process.env.EASYSHIP_ORIGIN_COUNTRY;
  const contactName = process.env.EASYSHIP_ORIGIN_CONTACT_NAME;
  const contactEmail = process.env.EASYSHIP_ORIGIN_CONTACT_EMAIL;

  if (
    !token ||
    !line1 ||
    !city ||
    !postalCode ||
    !country ||
    !contactName ||
    !contactEmail
  ) {
    return null;
  }

  return {
    token,
    origin: {
      line1,
      line2: process.env.EASYSHIP_ORIGIN_LINE2,
      city,
      state: process.env.EASYSHIP_ORIGIN_STATE,
      postalCode,
      country,
      contactName,
      contactEmail,
      contactPhone: process.env.EASYSHIP_ORIGIN_CONTACT_PHONE,
    },
  };
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

export const easyshipRequest = async <TResponse>(
  config: EasyshipConfig,
  path: string,
  body: unknown,
): Promise<TResponse> => {
  const base = config.token.startsWith(EASYSHIP_SANDBOX_TOKEN_PREFIX)
    ? EASYSHIP_SANDBOX_API_BASE
    : EASYSHIP_API_BASE;

  const response = await fetch(`${base}${path}`, {
    method: "POST",
    signal: AbortSignal.timeout(EASYSHIP_TIMEOUT_MS),
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const parsed = parseBody(await response.text());

  if (!response.ok) {
    throw new EasyshipApiError(
      `Easyship POST ${path} failed with ${response.status}`,
      response.status,
      parsed,
    );
  }

  return parsed as TResponse;
};

const buildOriginAddress = ({ origin }: EasyshipConfig) => ({
  line_1: origin.line1,
  ...(origin.line2 ? { line_2: origin.line2 } : {}),
  city: origin.city,
  ...(origin.state ? { state: origin.state } : {}),
  postal_code: origin.postalCode,
  country_alpha2: origin.country.toUpperCase(),
  contact_name: origin.contactName,
  contact_email: origin.contactEmail,
  ...(origin.contactPhone ? { contact_phone: origin.contactPhone } : {}),
});

export const buildRatesPayload = (
  config: EasyshipConfig,
  parcel: ShippingParcel,
  destination: ShippingDestination,
) => {
  const units = parcel.contents.reduce(
    (total, item) => total + item.quantity,
    0,
  );
  const unitWeightKg = units > 0 ? parcel.weightGrams / 1000 / units : 0;

  return {
    origin_address: buildOriginAddress(config),
    destination_address: {
      line_1: destination.line1 ?? "",
      city: destination.city ?? "",
      ...(destination.region ? { state: destination.region } : {}),
      postal_code: destination.postalCode ?? "",
      country_alpha2: destination.country.toUpperCase(),
    },
    parcels: [
      {
        items: parcel.contents.map((item) => ({
          description: EASYSHIP_CONTENTS_DESCRIPTION,
          quantity: item.quantity,
          actual_weight: unitWeightKg,
          dimensions: {
            length: parcel.lengthMm / 10,
            width: parcel.widthMm / 10,
            height: parcel.heightMm / 10,
          },
          declared_customs_value: item.valueAmount,
          declared_currency: parcel.valueCurrency,
          origin_country_alpha2:
            item.originCountry ?? DEFAULT_SHIPPING_ORIGIN_COUNTRY,
          ...(item.hsCode ? { hs_code: item.hsCode } : {}),
        })),
      },
    ],
  };
};

const transitDays = (rate: EasyshipRate) => {
  const min = rate.min_delivery_time;
  const max = rate.max_delivery_time;

  if (!min && !max) {
    return undefined;
  }

  return min && max && min !== max ? `${min}-${max}` : String(min ?? max);
};

export const toShippingOption = (rate: EasyshipRate): ShippingOption | null => {
  const amount = Number(rate.total_charge);
  const service =
    rate.courier_service?.name ?? rate.courier_service?.umbrella_name;

  if (!Number.isFinite(amount) || amount <= 0 || !service || !rate.currency) {
    return null;
  }

  return {
    id: `easyship:${rate.courier_service?.id ?? service}`,
    provider: "easyship",
    service,
    amount,
    currency: rate.currency as CurrencyCode,
    hasTracking: EASYSHIP_HAS_TRACKING,
    deliveryType: "address",
    transitDays: transitDays(rate),
  };
};

export const unwrapRates = (body: EasyshipRatesResponse): EasyshipRate[] =>
  Array.isArray(body?.rates) ? body.rates : [];
