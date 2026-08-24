import type { Locale } from "@/i18n/config";
import type { StoredCartItem } from "@/types/cart";
import type { ShippingQuoteRequest } from "@/types/order";
import type { ShippingQuoteGroup } from "@/types/shipping";

export type ShippingQuoteStatus =
  | "idle"
  | "loading"
  | "ok"
  | "unsupported-destination"
  | "unsupported-variant"
  | "unsupported-parcel"
  | "missing-shipping-data"
  | "unavailable";

export type UseShippingQuoteParams = {
  locale: Locale;
  items: StoredCartItem[];
  address: ShippingQuoteRequest["address"] | null;
  isEnabled: boolean;
  isLocationFieldFocused: boolean;
};

export type UseShippingQuoteResult = {
  status: ShippingQuoteStatus;
  shipping: number | null;
  groups: ShippingQuoteGroup[];
};
