import type { Locale } from "@/i18n/config";
import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminProductPayload } from "@/types/admin";
import type { CategoryDocument } from "@/types/catalog";
import type { ProductFileAsset, ProductImage } from "@/types/product-details";

export type AdminProductFormProps = {
  title: string;
  description: string;
  submitLabel: string;
  locale: Locale;
  dictionary: AdminPageDictionary["productForm"];
  sharedDictionary: AdminPageDictionary["shared"];
  payload: AdminProductPayload;
  categories: CategoryDocument[];
  action: (formData: FormData) => Promise<void>;
  isNew: boolean;
  errorMessage?: string;
};

export type AdminImageUploadFieldProps = {
  name: string;
  buttonLabel: string;
  helperText: string;
  thumbnailLabel: string;
  galleryLabel: string;
  existingImages: ProductImage[];
};

export type AdminFileUploadFieldProps = {
  name: string;
  buttonLabel: string;
  helperText: string;
  existingFiles: ProductFileAsset[];
};

export type PreviewImage = {
  id: string;
  src?: string;
  alt: string;
  emoji?: string;
  bgColor?: string;
};