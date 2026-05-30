import type { CountryCode } from "@/utils";

export type DeliveryPaymentVariant = "stripe" | "receipt";

export type DeliveryRegionTheme = {
  accent: string;
  heroGradient: string;
  paymentVariant: DeliveryPaymentVariant;
};

export const STRIPE_BRAND_COLOR = "#635BFF";

const STRIPE_GRADIENT =
  "linear-gradient(135deg, #e9f0fc 0%, #f0e6f9 55%, #f4e8ed 100%)";

const defaultDeliveryRegionTheme: DeliveryRegionTheme = {
  accent: "#3A72C4",
  heroGradient: STRIPE_GRADIENT,
  paymentVariant: "stripe",
};

const deliveryRegionThemes: Partial<Record<CountryCode, DeliveryRegionTheme>> =
  {
    US: defaultDeliveryRegionTheme,
    BY: {
      accent: "#D96C82",
      heroGradient:
        "linear-gradient(135deg, #fbe2e7 0%, #fce6d0 55%, #f8e8d4 100%)",
      paymentVariant: "receipt",
    },
  };

export const getDeliveryRegionTheme = (
  country: CountryCode,
): DeliveryRegionTheme =>
  deliveryRegionThemes[country] ?? defaultDeliveryRegionTheme;
