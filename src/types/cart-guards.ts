import type { StoredCartItem } from "./cart";

export const isCartSelections = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.values(value as Record<string, unknown>).every(
    (entry) => typeof entry === "string" || typeof entry === "undefined",
  );
};

export const isStoredCartItem = (value: unknown): value is StoredCartItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.productId === "string" &&
    typeof item.quantity === "number" &&
    (typeof item.selections === "undefined" || isCartSelections(item.selections))
  );
};