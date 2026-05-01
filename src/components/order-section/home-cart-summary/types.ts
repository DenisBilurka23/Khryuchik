import type { StorefrontDictionary } from "@/i18n/types";
import type { CountryCode } from "@/utils";
import type { CartItem } from "@/types/cart";

export type HomeCartSummaryProps = {
  locale: "ru" | "en";
  country: CountryCode;
  cartTitle: string;
  totalLabel: string;
  shopLabel: string;
  cartLabel: string;
  summaryLabels: StorefrontDictionary["orderSection"]["cartSummary"];
  shopHref: string;
  cartHref: string;
};

export type HomeCartSummaryViewModelParams = {
  locale: HomeCartSummaryProps["locale"];
  country: CountryCode;
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  labels: StorefrontDictionary["orderSection"]["cartSummary"];
};