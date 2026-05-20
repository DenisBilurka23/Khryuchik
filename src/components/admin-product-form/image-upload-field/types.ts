import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

import type { Locale } from "@/i18n/config";
import type { ProductImage } from "@/types/product-details";

export type AdminImageUploadFieldProps = {
  imagesJsonInputName: string;
  locale: Locale;
  productId?: string;
  buttonLabel: string;
  helperText: string;
  removeButtonLabel: string;
  thumbnailLabel: string;
  galleryLabel: string;
  existingImages: ProductImage[];
  statusLabels: {
    pending: string;
    uploading: string;
    uploaded: string;
    error: string;
  };
};

export type ImageUploadStatus = "pending" | "uploading" | "uploaded" | "error";

export type PreviewImage = {
  id: string;
  src?: string;
  alt: string;
  emoji?: string;
  bgColor?: string;
};

export type OrderedImageFieldItem = PreviewImage & {
  kind: "existing" | "new";
  existingImage?: ProductImage;
  file?: File;
  status?: ImageUploadStatus;
  progress?: number;
  uploadedImage?: ProductImage;
  errorMessage?: string;
};

export type ImageCardProps = {
  image: OrderedImageFieldItem;
  index: number;
  thumbnailLabel: string;
  galleryLabel: string;
  removeButtonLabel?: string;
  onRemoveAction?: () => void;
  isDragging?: boolean;
  isOverlay?: boolean;
  dragHandleListeners?: DraggableSyntheticListeners;
  dragHandleAttributes?: DraggableAttributes;
  statusLabel?: string;
  statusTone?: "info" | "success" | "error";
};
