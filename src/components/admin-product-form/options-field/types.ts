import type { ProductOption } from "@/types/product-details";

export type AdminOptionsFieldProps = {
  name: string;
  title: string;
  helperText: string;
  initialOptions: ProductOption[];
  itemLabel: string;
};