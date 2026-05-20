import type { Locale } from "@/i18n/config";
import type { ProductDetailTranslation, ProductTranslation } from "@/types/catalog";

export type AdminProductLocaleSectionProps = {
  locale: Locale;
  translation: ProductTranslation;
  details: ProductDetailTranslation;
  productId?: string;
};