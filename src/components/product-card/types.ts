import type { Locale } from "@/i18n/config";
import type { LocalizedProductSummary } from "@/types/catalog";

export type ProductCardProps = {
  product: LocalizedProductSummary;
  locale: Locale;
  addToCart: string;
  wishlistAriaLabel: string;
  outOfStock: string;
  viewProduct: string;
  detailsHref: string;
};
