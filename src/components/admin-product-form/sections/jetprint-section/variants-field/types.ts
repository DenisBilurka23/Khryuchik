import type { JetprintVariantLink } from "@/types/catalog";
import type { ProductOption } from "@/types/product-details";

export type AdminJetprintVariantRow = {
  id: string;
  sku: string;
  size: string;
  color: string;
  isAvailable?: boolean;
  checkedAt?: string;
};

export type AdminJetprintVariantsFieldProps = {
  name: string;
  initialVariants: JetprintVariantLink[];
  sizes: ProductOption[];
  colors: ProductOption[];
};

export type AdminJetprintVariantStatusKey =
  | "available"
  | "unavailable"
  | "unchecked"
  | "noShipping";
