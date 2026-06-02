import type { Locale } from "@/i18n/config";
import type { PaymentMethod } from "@/utils";

export type CheckoutResultKind = "success" | "cancel" | "confirmation";

export type CheckoutResultViewProps = {
  locale: Locale;
  kind: CheckoutResultKind;
  orderId?: string;
  paymentMethod?: PaymentMethod;
};
