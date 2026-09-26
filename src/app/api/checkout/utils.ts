import type { OrderCustomer, OrderShippingAddress } from "@/types/order";
import {
  asOptionalString,
  isIsoCountryCode,
  isPostalCodeValid,
  normalizeOrderEmail,
  type PaymentMethod,
} from "@/utils";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isPaymentMethod = (value: unknown): value is PaymentMethod =>
  value === "stripe" || value === "cod" || value === "telegram_transfer";

export const parseCustomer = (value: unknown): OrderCustomer | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;

  const requiredString = (key: string) =>
    typeof raw[key] === "string" && (raw[key] as string).trim().length > 0
      ? (raw[key] as string).trim()
      : null;

  const firstName = requiredString("firstName");
  const lastName = requiredString("lastName");

  if (!firstName || !lastName) {
    return null;
  }

  if (typeof raw.email !== "string" || raw.email.trim().length === 0) {
    return null;
  }

  return {
    firstName,
    lastName,
    email: normalizeOrderEmail(raw.email),
    phone: asOptionalString(raw.phone),
    telegram: asOptionalString(raw.telegram),
  };
};

export const parseShippingAddress = (
  value: unknown,
): OrderShippingAddress | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const raw = value as Record<string, unknown>;

  if (
    typeof raw.line1 !== "string" ||
    raw.line1.trim().length === 0 ||
    typeof raw.city !== "string" ||
    raw.city.trim().length === 0
  ) {
    return null;
  }

  const countryValue = typeof raw.country === "string" ? raw.country : "";

  if (!isIsoCountryCode(countryValue)) {
    return null;
  }

  if (
    typeof raw.postalCode !== "string" ||
    !isPostalCodeValid(raw.postalCode)
  ) {
    return null;
  }

  return {
    line1: raw.line1.trim(),
    line2: asOptionalString(raw.line2),
    city: raw.city.trim(),
    region: asOptionalString(raw.region),
    postalCode: raw.postalCode.trim(),
    country: countryValue,
  };
};

export const parseSelectedShippingOptionIds = (
  value: unknown,
): Record<string, string> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const entries = Object.entries(value as Record<string, unknown>).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
};

export const isValidEmail = (value: string) => emailPattern.test(value);
