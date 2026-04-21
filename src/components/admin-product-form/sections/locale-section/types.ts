import type { Locale } from "@/i18n/config";
import type { AdminPageDictionary } from "@/i18n/types";
import type { ProductDetailTranslation, ProductTranslation } from "@/types/catalog";

export type AdminProductLocaleSectionProps = {
  locale: Locale;
  dictionary: AdminPageDictionary["productForm"];
  translation: ProductTranslation;
  details: ProductDetailTranslation;
};