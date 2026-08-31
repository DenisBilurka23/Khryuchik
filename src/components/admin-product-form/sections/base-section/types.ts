import type { Locale } from "@/i18n/config";
import type { AdminProductPayload } from "@/types/admin";
import type { CategoryDocument, ProductType } from "@/types/catalog";
import type {
  ProductOption,
  ProductOptionPriceDelta,
} from "@/types/product-details";
import type { CurrencyCode } from "@/utils";

export type AdminProductBaseSectionProps = {
  payload: AdminProductPayload;
  categories: CategoryDocument[];
  locale: Locale;
  isNew: boolean;
  selectedType: ProductType;
  selectedCategory: string;
  merchCategories: CategoryDocument[];
  onTypeChangeAction: (value: ProductType) => void;
  onCategoryChangeAction: (value: string) => void;
  currencies: CurrencyCode[];
  formatOptions: ProductOption[];
  selectedFormats: ProductOption[];
  isFormatSelected: (value: string) => boolean;
  onToggleFormatAction: (value: string) => void;
  onFormatPriceDeltaChangeAction: (
    value: string,
    priceDelta?: ProductOptionPriceDelta,
  ) => void;
  languageOptions: ProductOption[];
  selectedLanguages: ProductOption[];
  isLanguageSelected: (code: string) => boolean;
  onToggleLanguageAction: (code: string) => void;
};
