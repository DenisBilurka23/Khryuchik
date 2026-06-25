import type { CurrencyCode } from "@/utils";

import type { ProductImage } from "./product-details";

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
  thumbnail?: ProductImage;
  thumbnailBackgroundColor?: string;
  quantity: number;
  variant?: string;
  isDigital?: boolean;
};

export type CartResolveResponse = {
  items: CartItem[];
};