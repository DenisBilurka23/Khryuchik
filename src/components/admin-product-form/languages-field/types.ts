import type { ProductPrintedStock } from "@/types/catalog";
import type { LocaleDocument } from "@/types/localization";
import type { ProductOption } from "@/types/product-details";
import type { ShippingHubCode } from "@/types/shipping";

export type AdminLanguagesFieldHub = {
  code: ShippingHubCode;
  label: string;
};

export type AdminLanguagesFieldProps = {
  name: string;
  title: string;
  helperText: string;
  adminLocale: string;
  availableLocales: LocaleDocument[];
  initialOptions: ProductOption[];
  stockName: string;
  stockTitle: string;
  stockHelperText: string;
  stockEmptyText: string;
  hubs: AdminLanguagesFieldHub[];
  initialStock: ProductPrintedStock;
};
