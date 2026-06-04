import type { Locale } from "@/i18n/config";
import type { AccountOrder } from "@/types/order";

export type OrdersSectionProps = {
  locale: Locale;
  orders: AccountOrder[];
};
