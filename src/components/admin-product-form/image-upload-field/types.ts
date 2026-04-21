import type { ProductImage } from "@/types/product-details";

export type AdminImageUploadFieldProps = {
  name: string;
  buttonLabel: string;
  helperText: string;
  thumbnailLabel: string;
  galleryLabel: string;
  existingImages: ProductImage[];
};

export type PreviewImage = {
  id: string;
  src?: string;
  alt: string;
  emoji?: string;
  bgColor?: string;
};