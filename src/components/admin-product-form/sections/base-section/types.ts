import type { Locale } from "@/i18n/config";
import type { AdminProductPayload } from "@/types/admin";
import type { CategoryDocument, ProductType } from "@/types/catalog";
import type { LocaleDocument, RegionDocument } from "@/types/localization";
import type { ProductOption } from "@/types/product-details";

export type AdminProductBaseSectionProps = {
  payload: AdminProductPayload;
  categories: CategoryDocument[];
  locale: Locale;
  isNew: boolean;
  selectedType: ProductType;
  selectedCategory: string;
  merchCategories: CategoryDocument[];
  onTypeChange: (value: ProductType) => void;
  onCategoryChange: (value: string) => void;
  availableLocales: LocaleDocument[];
  availableRegions: RegionDocument[];
  initialLanguages: ProductOption[];
  initialFormats: ProductOption[];
};