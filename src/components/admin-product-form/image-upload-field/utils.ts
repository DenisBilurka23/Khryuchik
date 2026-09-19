import type { ProductImage } from "@/types/product-details";

import type {
  AdminImageUploadFieldProps,
  OrderedImageFieldItem,
} from "./types";

export const mapExistingImages = (
  existingImages: ProductImage[],
): OrderedImageFieldItem[] =>
  existingImages.map((image) => ({
    id: image.id,
    kind: "existing",
    src: image.src,
    alt: image.alt ?? image.id,
    emoji: image.emoji,
    bgColor: image.bgColor,
    existingImage: image,
    status: "uploaded",
    progress: 1,
  }));

export const buildFinalImage = (
  item: OrderedImageFieldItem,
): ProductImage | null => {
  if (item.kind === "existing") {
    return item.existingImage ?? null;
  }

  if (item.status === "uploaded" && item.uploadedImage) {
    return item.uploadedImage;
  }

  return null;
};

export const buildImagesJsonValue = (items: OrderedImageFieldItem[]) =>
  JSON.stringify(
    items
      .map(buildFinalImage)
      .filter((image): image is ProductImage => image !== null),
  );

export const getStatusLabel = (
  item: OrderedImageFieldItem,
  labels: AdminImageUploadFieldProps["statusLabels"],
): { label: string; tone: "info" | "success" | "error" } | null => {
  if (item.kind === "existing") {
    return null;
  }

  switch (item.status) {
    case "uploading":
      return {
        label: `${labels.uploading} ${Math.round((item.progress ?? 0) * 100)}%`,
        tone: "info",
      };
    case "error":
      return { label: labels.error, tone: "error" };
    case "uploaded":
      return { label: labels.uploaded, tone: "success" };
    case "pending":
    default:
      return null;
  }
};
