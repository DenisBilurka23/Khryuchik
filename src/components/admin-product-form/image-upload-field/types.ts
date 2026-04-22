import type {
  DraggableAttributes,
  DraggableSyntheticListeners,
} from "@dnd-kit/core";

import type { ProductImage } from "@/types/product-details";

export type AdminImageUploadFieldProps = {
  name: string;
  existingImagesInputName: string;
  imageOrderInputName: string;
  buttonLabel: string;
  helperText: string;
  removeButtonLabel: string;
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

export type OrderedImageFieldItem = PreviewImage & {
  kind: "existing" | "new";
  existingImage?: ProductImage;
};

export type OrderedImageFieldEntry = {
  id: string;
  kind: OrderedImageFieldItem["kind"];
};

export type ImageCardProps = {
  image: OrderedImageFieldItem;
  index: number;
  thumbnailLabel: string;
  galleryLabel: string;
  removeButtonLabel?: string;
  onRemove?: () => void;
  isDragging?: boolean;
  isOverlay?: boolean;
  dragHandleListeners?: DraggableSyntheticListeners;
  dragHandleAttributes?: DraggableAttributes;
};