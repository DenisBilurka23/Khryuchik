import type { Locale } from "@/i18n/config";
import type { CartPageLabels } from "@/i18n/types";
import type { CountryCode } from "@/shared/countries";
import type { CartItem, CartSelections, StoredCartItem } from "@/types/cart";

export type CartState = {
  items: StoredCartItem[];
};

export type CartSnapshot = {
  items: StoredCartItem[];
  totalCount: number;
};

export type CartItemInput = {
  productId: string;
  quantity?: number;
  selections?: CartSelections;
};

export type OrderSummaryCardProps = {
  locale: Locale;
  country: CountryCode;
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