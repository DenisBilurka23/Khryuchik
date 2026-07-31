import type { ProductOptionPriceDelta } from "@/types/product-details";
import type { RegionDocument } from "@/types/localization";

export type AdminOptionPriceDeltaFieldProps = {
  label: string;
  regions: RegionDocument[];
  priceDelta?: ProductOptionPriceDelta;
  onChangeAction: (priceDelta: ProductOptionPriceDelta | undefined) => void;
};
