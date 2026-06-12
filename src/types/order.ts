import type { Locale } from "@/i18n/config";
import type { StoredCartItem } from "@/types/cart";
import type {
  CountryCode,
  CurrencyCode,
  PaymentMethod,
} from "@/utils/country";

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
  country: string;
};

export type OrderPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "cod_pending";

export const ORDER_STATUSES = [
  "new",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

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
  userId?: string;
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

export type CustomerOrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type AccountOrder = {
  id: string;
  number: string;
  createdAt: string;
  itemsSummary: string;
  total: string;
  status: CustomerOrderStatus;
};

export type CreateOrderInput = {
  locale: Locale;
  country: CountryCode;
  items: StoredCartItem[];
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  paymentMethod: PaymentMethod;
  userId?: string;
  notes?: string;
};
