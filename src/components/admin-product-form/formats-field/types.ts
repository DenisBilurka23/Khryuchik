import type { ProductOption } from "@/types/product-details";

export type AdminFormatsFieldProps = {
  name: string;
  title: string;
  helperText: string;
  options: ProductOption[];
  selectedOptions: ProductOption[];
  isFormatSelected: (value: string) => boolean;
  onToggleAction: (value: string) => void;
};
