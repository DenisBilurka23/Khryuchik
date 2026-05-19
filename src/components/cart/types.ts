import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";
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