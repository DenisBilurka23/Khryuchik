import type { Locale } from "@/i18n/config";
import type { OrderFulfillment } from "@/types/order";
import type { CurrencyCode } from "@/utils";

export type AdminOrderFulfillmentsProps = {
  orderId: string;
  locale: Locale;
  currency: CurrencyCode;
  fulfillments?: OrderFulfillment[];
  buyableIds: string[];
};
