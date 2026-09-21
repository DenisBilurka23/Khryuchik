import type { OrderItemThumbnailViewModel } from "../types";

export type OrderItemThumbnailSize = "sm" | "md";

export type OrderItemThumbnailProps = OrderItemThumbnailViewModel & {
  size?: OrderItemThumbnailSize;
};
