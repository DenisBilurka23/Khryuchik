// Countries Printify's print providers will not ship to. Printify publishes no
// endpoint for this — `POST /orders/shipping.json` is a tariff calculator and
// happily prices most of these - so the list is transcribed by hand from the
// shipping-restrictions article in the Printify Help Center
// (https://help.printify.com, search "shipping restrictions").
//
import type { OrderStatus } from "@/types/order";

export const PRINTIFY_STANDARD_SHIPPING_METHOD = 1;

export const PRINTIFY_RESTRICTED_COUNTRIES = [
  "BY",
  "CU",
  "IR",
  "KP",
  "PS",
  "RU",
  "SY",
  "UA",
];

export const PRINTIFY_WEBHOOK_TOPICS = [
  "order:updated",
  "order:sent-to-production",
  "order:shipment:created",
  "order:shipment:delivered",
  "shop:disconnected",
] as const;

export const PRINTIFY_ORDER_STATUS_MAP: Partial<Record<string, OrderStatus>> = {
  "in-production": "processing",
  fulfilled: "shipped",
  "partially-fulfilled": "shipped",
  shipped: "shipped",
  delivered: "delivered",
};

export const PRINTIFY_CANCELLED_ORDER_STATUSES = [
  "canceled",
  "cancelled",
  "canceled-by-provider",
];
