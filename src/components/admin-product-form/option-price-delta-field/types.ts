import type { ProductOptionPriceDelta } from "@/types/product-details";
import type { CurrencyCode } from "@/utils";

export type AdminOptionPriceDeltaFieldProps = {
  label: string;
  currencies: CurrencyCode[];
  priceDelta?: ProductOptionPriceDelta;
  onChangeAction: (priceDelta: ProductOptionPriceDelta | undefined) => void;
};
