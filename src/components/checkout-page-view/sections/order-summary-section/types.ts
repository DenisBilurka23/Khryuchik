import type { ShippingQuoteStatus } from "@/hooks/useShippingQuote.types";
import type { Locale } from "@/i18n/config";
import type { CartItem } from "@/types/cart";
import type { CurrencyCode, PaymentMethod } from "@/utils";

import type { CheckoutLabels } from "../../types";

export type OrderSummarySectionProps = {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  shippingStatus: ShippingQuoteStatus;
  isDigitalOnly: boolean;
  total: number;
  currency: CurrencyCode;
  locale: Locale;
  error: string | null;
  isSubmitting: boolean;
  isBlocked: boolean;
  hasStoredItems: boolean;
  paymentMethod: PaymentMethod;
  labels: CheckoutLabels;
};
