import type { Locale } from "@/i18n/config";
import type { ProductJetprintLink } from "@/types/catalog";
import type { ProductOption } from "@/types/product-details";

export type AdminProductJetprintSectionProps = {
  locale: Locale;
  productId?: string;
  link?: ProductJetprintLink;
  sizes: ProductOption[];
  colors: ProductOption[];
};
