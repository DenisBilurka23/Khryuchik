import type { RegionDocument } from "@/types/localization";
import type { ProductOption } from "@/types/product-details";

export type AdminOptionsFieldProps = {
  name: string;
  title: string;
  helperText: string;
  priceDeltaHelperText: string;
  initialOptions: ProductOption[];
  itemLabel: string;
  regions: RegionDocument[];
};