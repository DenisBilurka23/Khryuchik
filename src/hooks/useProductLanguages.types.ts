import type { ProductPrintedStock } from "@/types/catalog";
import type { LocaleDocument } from "@/types/localization";
import type { ProductOption } from "@/types/product-details";
import type { ShippingHubCode } from "@/types/shipping";

export type UseProductLanguagesArgs = {
  availableLocales: LocaleDocument[];
  adminLocale: string;
  initialOptions: ProductOption[];
  initialStock: ProductPrintedStock;
};

export type UseProductLanguagesResult = {
  options: ProductOption[];
  selectedOptions: ProductOption[];
  isLanguageSelected: (code: string) => boolean;
  toggleLanguage: (code: string) => void;
  isStocked: (code: string, hub: ShippingHubCode) => boolean;
  toggleHub: (code: string, hub: ShippingHubCode) => void;
  postedStock: ProductPrintedStock;
};
