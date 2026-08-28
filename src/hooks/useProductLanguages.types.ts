import type { ProductPrintedStock } from "@/types/catalog";
import type { LocaleDocument } from "@/types/localization";
import type { ProductOption } from "@/types/product-details";
import type { ShippingHubCode } from "@/types/shipping";

export type UseProductLanguagesArgs = {
  availableLocales: LocaleDocument[];
  adminLocale: string;
  initialOptions: ProductOption[];
  initialStock: ProductPrintedStock;
  isNew: boolean;
};

export type UseProductLanguagesResult = {
  options: ProductOption[];
  selectedOptions: ProductOption[];
  isLanguageSelected: (code: string) => boolean;
  toggleLanguage: (code: string) => void;
  getHubStock: (code: string, hub: ShippingHubCode) => number;
  setHubStock: (code: string, hub: ShippingHubCode, quantity: number) => void;
  postedStock: ProductPrintedStock;
};
