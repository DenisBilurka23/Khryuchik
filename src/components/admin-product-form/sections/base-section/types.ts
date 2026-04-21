import type { Locale } from "@/i18n/config";
import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminProductPayload } from "@/types/admin";
import type { CategoryDocument, ProductType } from "@/types/catalog";

export type AdminProductBaseSectionProps = {
  dictionary: AdminPageDictionary["productForm"];
  sharedDictionary: AdminPageDictionary["shared"];
  payload: AdminProductPayload;
  categories: CategoryDocument[];
  locale: Locale;
  isNew: boolean;
  selectedType: ProductType;
  selectedCategory: string;
  merchCategories: CategoryDocument[];
  onTypeChange: (value: ProductType) => void;
  onCategoryChange: (value: string) => void;
};