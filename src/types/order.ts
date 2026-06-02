import type { Locale } from "@/i18n/config";
import type { StoredCartItem } from "@/types/cart";
import type { CountryCode, CurrencyCode, PaymentMethod } from "@/utils";

export type OrderItem = {
  productId: string;
  slug: string;
  title: string;
  emoji: string;
  thumbnailBackgroundColor?: string;
  variant?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type OrderCustomer = {
  name: string;
  email?: string;
  phone?: string;
  telegram?: string;
};

export type OrderShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  country: CountryCode;
};

export type OrderPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cod_pending";

export type OrderStatus =
  | "new"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderPaymentInfo = {
  method: PaymentMethod;
  status: OrderPaymentStatus;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paidAt?: string;
};

export type OrderDocument = {
  id: string;
  createdAt: string;
  locale: Locale;
  country: CountryCode;
  currency: CurrencyCode;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  payment: OrderPaymentInfo;
  status: OrderStatus;
  notes?: string;
};

export type CreateOrderInput = {
  locale: Locale;
  country: CountryCode;
  items: StoredCartItem[];
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  paymentMethod: PaymentMethod;
  notes?: string;
};
