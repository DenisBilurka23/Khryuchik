import type { Locale } from "@/i18n/config";
import type { CartPageLabels } from "@/i18n/types";
import type { CartItem } from "@/types/cart";

export type CartState = {
  items: CartItem[];
};

export type CartSnapshot = {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
};

export type CartItemInput = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number;
};

export type OrderSummaryCardProps = {
  locale: Locale;
  labels: CartPageLabels["summary"];
  subtotal: number;
  shipping: number;
  discount: number;
  continueShoppingHref: string;
};

export type EmptyCartStateProps = {
  title: string;
  text: string;
  actionLabel: string;
  actionHref: string;
};

export type CartItemCardProps = {
  item: CartItem;
  locale: Locale;
  variantLabel: string;
  removeLabel: string;
  onDecrease: (id: string) => void;
  onIncrease: (id: string) => void;
  onRemove: (id: string) => void;
};