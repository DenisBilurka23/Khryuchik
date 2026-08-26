import type { CountryCode, CurrencyCode } from "@/utils";

export type ShippingHubCode = "europe" | "northAmerica";

export type ShippingProviderCode =
  | "bpost"
  | "easyship"
  | "chitchats"
  | "printify";

export type ShippingDeliveryType = "address" | "pickup-point";

export type ShippingParcelItem = {
  quantity: number;
  valueAmount: number;
  hsCode?: string;
  originCountry?: string;
};

export type ShippingParcel = {
  weightGrams: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  valueAmount: number;
  valueCurrency: CurrencyCode;
  contents: ShippingParcelItem[];
};

export type ShippingDestination = {
  country: CountryCode;
  region?: string;
  city?: string;
  postalCode?: string;
  line1?: string;
};

export type ShippingOption = {
  id: string;
  provider: ShippingProviderCode;
  service: string;
  amount: number;
  currency: CurrencyCode;
  hasTracking: boolean;
  deliveryType: ShippingDeliveryType;
  transitDays?: string;
  externalId?: string;
};

export type ShippingRateRule = {
  zone: string;
  service: string;
  hasTracking: boolean;
  deliveryType: ShippingDeliveryType;
  maxWeightGrams: number;
  amount: number;
  currency: CurrencyCode;
};

export type ShippingQuoteGroup = {
  id: string;
  source: "digital" | "printify" | "manual";
  options: ShippingOption[];
  selectedOptionId: string | null;
  amount: number;
};

export type ShippingFulfillmentGroup = ShippingQuoteGroup & {
  parcel?: ShippingParcel;
};

export type ShippingLabel = {
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  amount?: number;
  currency?: CurrencyCode;
  labelUrl?: string;
};

export type ShippingLabelRecipient = {
  name: string;
  email?: string;
  phone?: string;
  destination: ShippingDestination;
};

export type ShippingLabelRequest = {
  // Ours, so the carrier record points back at the order rather than at a quote.
  orderId: string;
  service: string;
  parcel: ShippingParcel;
  recipient: ShippingLabelRecipient;
  valueCurrency: CurrencyCode;
};

export type ShippingLabelResult =
  | { status: "bought"; label: ShippingLabel; externalId: string }
  | { status: "bought-unparsed"; externalId: string; detail: string }
  | { status: "failed"; reason: string };

export type ShippingQuote =
  | { status: "quoted"; options: ShippingOption[] }
  | { status: "unsupported-destination" }
  | { status: "unsupported-parcel" }
  | { status: "unavailable" };
