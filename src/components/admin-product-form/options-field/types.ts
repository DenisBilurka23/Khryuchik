import type { ProductOption } from "@/types/product-details";
import type { CurrencyCode } from "@/utils";

export type AdminOptionsFieldProps = {
  name: string;
  title: string;
  helperText: string;
  priceDeltaHelperText: string;
  initialOptions: ProductOption[];
  itemLabel: string;
  currencies: CurrencyCode[];
};
