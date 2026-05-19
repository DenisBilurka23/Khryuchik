import type { Locale } from "@/i18n/config";
import type { CategoryDocument } from "@/types/catalog";

export type AdminProductFormHeroProps = {
  productId?: string;
  deleteAction?: (formData: FormData) => Promise<void>;
  isNew: boolean;
  locale: Locale;
  categories: CategoryDocument[];
  selectedType: "book" | "merch";
  selectedCategory: string;
  isActive: boolean;
  totalImages: number;
  totalAssets: number;
  isSubmitting?: boolean;
};