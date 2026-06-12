import type { ProductOption } from "@/types/product-details";

export type AdminFormatsFieldProps = {
  name: string;
  title: string;
  helperText: string;
  printedLabel: string;
  digitalLabel: string;
  initialFormats: ProductOption[];
};
