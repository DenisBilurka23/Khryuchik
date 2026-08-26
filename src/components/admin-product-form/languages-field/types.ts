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
  options: ProductOption[];
  selectedOptions: ProductOption[];
  isLanguageSelected: (code: string) => boolean;
  onToggleAction: (code: string) => void;
};
