import type { Locale } from "@/i18n/config";
import type {
  ProductDetailTranslation,
  ProductTranslation,
  ProductType,
} from "@/types/catalog";

export type AdminProductLocaleSectionProps = {
  locale: Locale;
  label: string;
  isActive: boolean;
  canToggle: boolean;
  onToggleActive: () => void;
  translation: ProductTranslation;
  details: ProductDetailTranslation;
  productId?: string;
  selectedType: ProductType;
};