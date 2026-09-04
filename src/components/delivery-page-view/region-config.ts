import { getCountryPaymentMethods } from "@/utils";
import type { CountryCode } from "@/utils";

export type DeliveryPaymentVariant = "stripe" | "receipt";

export const STRIPE_BRAND_COLOR = "#635bff";

export const getDeliveryPaymentVariant = (
  country: CountryCode,
): DeliveryPaymentVariant =>
  getCountryPaymentMethods(country).includes("stripe") ? "stripe" : "receipt";
