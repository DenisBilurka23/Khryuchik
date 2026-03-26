import type { CurrencyCode } from "@/lib/countries";

export type CartSelections = {
  language?: string;
  format?: string;
  size?: string;
  color?: string;
};

export type StoredCartItem = {
  id: string;
  productId: string;
  quantity: number;
  selections?: CartSelections;
};

export type CartItem = {
  id: string;
  productId: string;
  slug: string;
  title: string;
  price: number;
  currency: CurrencyCode;
  emoji: string;
  bgColor?: string;
  quantity: number;
  variant?: string;
};

export type CartResolveResponse = {
  items: CartItem[];
};