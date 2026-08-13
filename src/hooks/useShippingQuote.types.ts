import type { Locale } from "@/i18n/config";
import type { StoredCartItem } from "@/types/cart";
import type { ShippingQuoteRequest } from "@/types/order";

export type ShippingQuoteStatus =
  | "idle"
  | "loading"
  | "ok"
  | "unsupported-destination"
  | "unavailable";

export type UseShippingQuoteParams = {
  locale: Locale;
  items: StoredCartItem[];
  address: ShippingQuoteRequest["address"] | null;
  isEnabled: boolean;
};

export type UseShippingQuoteResult = {
  status: ShippingQuoteStatus;
  shipping: number | null;
};
