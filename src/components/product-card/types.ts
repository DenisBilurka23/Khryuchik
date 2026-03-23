import type { Locale } from "@/i18n/config";
import type { StorefrontDictionary } from "@/i18n/types";

export type ProductCardProps = {
  product: StorefrontDictionary["shopSection"]["items"][number];
  locale: Locale;
  addToCart: string;
  wishlistAriaLabel: string;
  onAddToCart: (productId: string) => void;
};
