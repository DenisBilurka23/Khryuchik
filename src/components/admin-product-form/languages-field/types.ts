import type { LocaleDocument } from "@/types/localization";
import type { ProductOption } from "@/types/product-details";

export type AdminLanguagesFieldProps = {
  name: string;
  title: string;
  helperText: string;
  adminLocale: string;
  availableLocales: LocaleDocument[];
  initialOptions: ProductOption[];
};
