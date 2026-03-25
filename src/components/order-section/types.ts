import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";
import type { CartItem } from "@/types/cart";

export type OrderSectionProps = {
  locale: Locale;
  dictionary: StorefrontDictionary;
  shopHref: string;
  cartHref: string;
};

export type HomeCartSummaryProps = {
  locale: "ru" | "en";
  cartTitle: string;
  emptyTitle: string;
  emptyText: string;
  totalLabel: string;
  shopLabel: string;
  cartLabel: string;
  summaryLabels: StorefrontDictionary["orderSection"]["cartSummary"];
  shopHref: string;
  cartHref: string;
};

export type HomeCartSummaryItemCountParams = {
  count: number;
  locale: HomeCartSummaryProps["locale"];
  labels: StorefrontDictionary["orderSection"]["cartSummary"]["itemCount"];
};

export type HomeCartSummaryViewModelParams = {
  locale: HomeCartSummaryProps["locale"];
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  labels: StorefrontDictionary["orderSection"]["cartSummary"];
};
