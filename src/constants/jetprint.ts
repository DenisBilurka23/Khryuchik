import type { OrderStatus } from "@/types/order";

export const JETPRINT_CURRENCY = "USD";

export const JETPRINT_SUCCESS_CODE = 200;

export const JETPRINT_STANDARD_LOGISTICS = 1;

export const JETPRINT_FACTORY_DIRECT_DELIVERY = 1;

export const JETPRINT_DUPLICATE_ORDER_MARKER = "已经导入过了";

export const JETPRINT_ORDER_STATUS = {
  pending: 1,
  inProduction: 2,
  partiallyShipped: 3,
  shipped: 4,
  cancelled: 99,
} as const;

export const JETPRINT_ORDER_STATUS_MAP: Partial<Record<number, OrderStatus>> = {
  [JETPRINT_ORDER_STATUS.inProduction]: "processing",
  [JETPRINT_ORDER_STATUS.partiallyShipped]: "shipped",
  [JETPRINT_ORDER_STATUS.shipped]: "shipped",
};

export const JETPRINT_KNOWN_ORDER_STATUSES: readonly number[] = Object.values(
  JETPRINT_ORDER_STATUS,
);

export const JETPRINT_VARIANT_STATUS = {
  active: 1,
  notFound: 2,
  removed: 3,
} as const;

export const JETPRINT_DELETED_WAYBILL_STATUS = 4;

export const JETPRINT_SHIPPED_WAYBILL_STATUS = 3;

export const JETPRINT_SYNC_BUDGET_MS = 40_000;

export const JETPRINT_SYNC_WINDOW_DAYS = 60;

export const JETPRINT_UPLOAD_CONTENT_TYPES = ["image/png", "image/jpeg"];

export const JETPRINT_UPLOAD_ACCEPT = JETPRINT_UPLOAD_CONTENT_TYPES.join(",");
