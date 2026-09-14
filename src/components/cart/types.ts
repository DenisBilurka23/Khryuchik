import type { SxProps, Theme } from "@mui/material";

import type { Locale } from "@/i18n/config";
import type { PromoCodeStatus } from "@/hooks/usePromoCode.types";
import type { CurrencyCode } from "@/utils";
import type { CartItem, CartSelections, StoredCartItem } from "@/types/cart";
import type { OrderPromoCode } from "@/types/order";

export type CartState = {
  items: StoredCartItem[];
};

export type CartSnapshot = {
  items: StoredCartItem[];
  totalCount: number;
};

export type CartToastSnapshot = {
  open: boolean;
  addedCount: number;
};

export type CartItemInput = {
  productId: string;
  quantity?: number;
  selections?: CartSelections;
};

export type PromoCodeFieldProps = {
  code: string;
  appliedPromo: OrderPromoCode | null;
  status: PromoCodeStatus;
  onCodeChange: (value: string) => void;
  onApply: () => void;
  onRemove: () => void;
  sx?: SxProps<Theme>;
};

export type OrderSummaryCardProps = {
  locale: Locale;
  currency: CurrencyCode;
  subtotal: number;
  promo: PromoCodeFieldProps;
  discount: number;
  isDigitalOnly: boolean;
  continueShoppingHref: string;
  checkoutHref: string;
  isShopClosed?: boolean;
  hasUnavailableItems?: boolean;
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
  soldOutLabel: string;
  onDecrease: (id: string) => void;
  onIncrease: (id: string) => void;
  onRemove: (id: string) => void;
};