import { getCountryPaymentMethods } from "@/utils";
import type { CountryCode } from "@/utils";

export type DeliveryPaymentVariant = "stripe" | "receipt";

type DeliveryRegionPalette = {
  accent: string;
  heroGradient: string;
};

export type DeliveryRegionTheme = DeliveryRegionPalette & {
  paymentVariant: DeliveryPaymentVariant;
};

export const STRIPE_BRAND_COLOR = "#635BFF";

const STRIPE_GRADIENT =
  "linear-gradient(135deg, #e9f0fc 0%, #f0e6f9 55%, #f4e8ed 100%)";

const defaultPalette: DeliveryRegionPalette = {
  accent: "#3A72C4",
  heroGradient: STRIPE_GRADIENT,
};

const regionPalettes: Partial<Record<CountryCode, DeliveryRegionPalette>> = {
  US: defaultPalette,
  BY: {
    accent: "#D96C82",
    heroGradient:
      "linear-gradient(135deg, #fbe2e7 0%, #fce6d0 55%, #f8e8d4 100%)",
  },
};

const resolvePaymentVariant = (
  country: CountryCode,
): DeliveryPaymentVariant =>
  getCountryPaymentMethods(country).includes("stripe") ? "stripe" : "receipt";

export const getDeliveryRegionTheme = (
  country: CountryCode,
): DeliveryRegionTheme => ({
  ...(regionPalettes[country] ?? defaultPalette),
  paymentVariant: resolvePaymentVariant(country),
});
