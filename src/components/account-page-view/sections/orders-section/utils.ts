import { BOOK_FORMAT } from "@/constants/catalog";
import type { ProductPreview } from "@/types/catalog";
import type { AccountOrderItem } from "@/types/order";

import type { OrderItemThumbnailViewModel } from "./types";

export const getOrderItemThumbnail = (
  item: AccountOrderItem,
  product?: ProductPreview,
): OrderItemThumbnailViewModel => ({
  src: product?.thumbnailSrc,
  alt: item.title,
  emoji: product?.emoji ?? item.emoji,
  background:
    product?.thumbnailBackgroundColor ?? item.thumbnailBackgroundColor,
});

export const getOrderItemDetails = (
  item: AccountOrderItem,
  formatLabels: { digital: string; printed: string },
): string[] => {
  if (item.variant) {
    return item.variant
      .split("/")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  if (item.formatSelection) {
    return [
      item.formatSelection === BOOK_FORMAT.digital
        ? formatLabels.digital
        : formatLabels.printed,
    ];
  }

  return [];
};
