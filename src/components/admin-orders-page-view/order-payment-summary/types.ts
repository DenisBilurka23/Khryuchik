import type { Locale } from "@/i18n/config";
import type { OrderPaymentInfo } from "@/types/order";
import type { CurrencyCode } from "@/utils";

export type AdminOrderPaymentSummaryProps = {
  payment: OrderPaymentInfo;
  locale: Locale;
  currency: CurrencyCode;
};
