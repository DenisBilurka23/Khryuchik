import type { ProductFileAsset } from "@/types/product-details";

export type AdminFileUploadFieldProps = {
  name: string;
  buttonLabel: string;
  helperText: string;
  existingFiles: ProductFileAsset[];
};