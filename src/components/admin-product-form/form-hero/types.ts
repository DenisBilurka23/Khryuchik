import type { Locale } from "@/i18n/config";
import type { AdminPageDictionary } from "@/i18n/types";
import type { CategoryDocument } from "@/types/catalog";

export type AdminProductFormHeroProps = {
  title: string;
  description: string;
  submitLabel: string;
  isNew: boolean;
  locale: Locale;
  dictionary: AdminPageDictionary["productForm"];
  sharedDictionary: AdminPageDictionary["shared"];
  categories: CategoryDocument[];
  selectedType: "book" | "merch";
  selectedCategory: string;
  isActive: boolean;
  totalImages: number;
  totalAssets: number;
};