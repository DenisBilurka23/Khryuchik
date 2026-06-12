import { POST } from "@/client-api";
import type { Locale } from "@/i18n/config";
import type { StoredCartItem } from "@/types/cart";
import type {
  OrderCustomer,
  OrderShippingAddress,
} from "@/types/order";
import type { PaymentMethod } from "@/utils";

export type CheckoutRequestPayload = {
  locale: Locale;
  items: StoredCartItem[];
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
};

export type CheckoutSuccessResponse = {
  orderId: string;
  redirectUrl?: string;
};

export type CheckoutErrorResponse = {
  error: string;
};

export const submitCheckoutClient = async (payload: CheckoutRequestPayload) =>
  POST<CheckoutSuccessResponse | CheckoutErrorResponse>(
    "/api/checkout",
    payload,
  );
