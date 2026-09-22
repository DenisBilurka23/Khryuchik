import {
  MAX_CART_ITEM_QUANTITY,
  MIN_CART_ITEM_QUANTITY,
} from "@/constants/cart";

export const isCartItemQuantity = (value: unknown): value is number =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= MIN_CART_ITEM_QUANTITY &&
  value <= MAX_CART_ITEM_QUANTITY;

export const clampCartItemQuantity = (value: number): number => {
  if (!Number.isFinite(value)) {
    return MIN_CART_ITEM_QUANTITY;
  }

  return Math.min(
    MAX_CART_ITEM_QUANTITY,
    Math.max(MIN_CART_ITEM_QUANTITY, Math.trunc(value)),
  );
};
