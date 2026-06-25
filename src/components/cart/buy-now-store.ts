import { BUY_NOW_STORAGE_KEY } from "@/constants/cart";
import type { StoredCartItem } from "@/types/cart";

import type { CartItemInput } from "./types";

const buildItemId = (
  productId: string,
  selections?: CartItemInput["selections"],
): string => {
  const entries = Object.entries(selections ?? {})
    .filter(([, v]) => Boolean(v))
    .sort(([a], [b]) => a.localeCompare(b));

  return entries.length === 0
    ? productId
    : `${productId}::${entries.map(([k, v]) => `${k}:${v}`).join("|")}`;
};

export const setBuyNowItem = (input: CartItemInput): void => {
  const item: StoredCartItem = {
    id: buildItemId(input.productId, input.selections),
    productId: input.productId,
    quantity: input.quantity ?? 1,
    selections: input.selections,
  };

  try {
    sessionStorage.setItem(BUY_NOW_STORAGE_KEY, JSON.stringify(item));
  } catch {}
};

export const getBuyNowItem = (): StoredCartItem | null => {
  try {
    const raw = sessionStorage.getItem(BUY_NOW_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredCartItem) : null;
  } catch {
    return null;
  }
};

export const clearBuyNowItem = (): void => {
  try {
    sessionStorage.removeItem(BUY_NOW_STORAGE_KEY);
  } catch {}
};
