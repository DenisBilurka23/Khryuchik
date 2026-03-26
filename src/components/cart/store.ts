"use client";

import { useSyncExternalStore } from "react";

import type { StoredCartItem } from "@/types/cart";
import type { CartItemInput, CartSnapshot, CartState } from "./types";

const STORAGE_KEY = "khryuchik-cart";
const emptyState: CartState = { items: [] };
const emptySnapshot: CartSnapshot = {
  items: [],
  totalCount: 0,
};

let state = emptyState;
let stateLoaded = false;
let storageListenerAttached = false;
let snapshot: CartSnapshot = emptySnapshot;

const listeners = new Set<() => void>();

const isCartSelections = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return false;
  }

  return Object.values(value as Record<string, unknown>).every(
    (entry) => typeof entry === "string" || typeof entry === "undefined",
  );
};

const isStoredCartItem = (value: unknown): value is StoredCartItem => {
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

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const buildSnapshot = (currentState: CartState): CartSnapshot => ({
  items: currentState.items,
  totalCount: currentState.items.reduce((sum, item) => sum + item.quantity, 0),
});

const refreshSnapshot = () => {
  snapshot = buildSnapshot(state);
};

const parseJson = <T,>(rawValue: string): T | null => {
  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return null;
  }
};

const readStateFromStorage = (): CartState => {
  if (typeof window === "undefined") {
    return emptyState;
  }

  const rawValue = window.localStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return emptyState;
  }

  const parsedValue = parseJson<unknown>(rawValue);

  if (!Array.isArray(parsedValue)) {
    return emptyState;
  }

  const items = parsedValue.filter(isStoredCartItem);

  return { items };
};

const persistState = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // Ignore persistence failures and keep in-memory cart working.
  }
};

const ensureStateLoaded = () => {
  if (!stateLoaded) {
    state = readStateFromStorage();
    stateLoaded = true;
    refreshSnapshot();
  }

  return state;
};

const buildCartItemId = (
  productId: string,
  selections?: CartItemInput["selections"],
) => {
  const selectionEntries = Object.entries(selections ?? {})
    .filter(([, value]) => Boolean(value))
    .sort(([left], [right]) => left.localeCompare(right));

  if (selectionEntries.length === 0) {
    return productId;
  }

  return `${productId}::${selectionEntries
    .map(([key, value]) => `${key}:${value}`)
    .join("|")}`;
};

const createCartItem = ({ quantity = 1, productId, selections }: CartItemInput): StoredCartItem => ({
  id: buildCartItemId(productId, selections),
  productId,
  quantity,
  selections,
});

const setCartState = (nextState: CartState) => {
  state = nextState;
  stateLoaded = true;
  refreshSnapshot();
  persistState();
  emitChange();
};

const handleStorage = (event: StorageEvent) => {
  if (event.key !== STORAGE_KEY) {
    return;
  }

  state = readStateFromStorage();
  stateLoaded = true;
  refreshSnapshot();
  emitChange();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  if (typeof window !== "undefined" && !storageListenerAttached) {
    window.addEventListener("storage", handleStorage);
    storageListenerAttached = true;
  }

  return () => {
    listeners.delete(listener);

    if (
      typeof window !== "undefined" &&
      storageListenerAttached &&
      listeners.size === 0
    ) {
      window.removeEventListener("storage", handleStorage);
      storageListenerAttached = false;
    }
  };
};

const getSnapshot = (): CartSnapshot => {
  ensureStateLoaded();
  return snapshot;
};

const getServerSnapshot = (): CartSnapshot => emptySnapshot;

export const addCartItem = (item: CartItemInput) => {
  const nextItem = createCartItem(item);
  const currentState = ensureStateLoaded();
  const existingItemIndex = currentState.items.findIndex(
    (entry) => entry.id === nextItem.id,
  );

  if (existingItemIndex === -1) {
    setCartState({
      items: [...currentState.items, nextItem],
    });
    return;
  }

  const items = [...currentState.items];
  items[existingItemIndex] = {
    ...items[existingItemIndex],
    quantity: items[existingItemIndex].quantity + nextItem.quantity,
  };

  setCartState({ items });
};

export const updateCartItemQuantity = (id: string, quantity: number) => {
  const currentState = ensureStateLoaded();

  if (quantity <= 0) {
    setCartState({
      items: currentState.items.filter((item) => item.id !== id),
    });
    return;
  }

  setCartState({
    items: currentState.items.map((item) =>
      item.id === id ? { ...item, quantity } : item,
    ),
  });
};

export const removeCartItem = (id: string) => {
  const currentState = ensureStateLoaded();

  setCartState({
    items: currentState.items.filter((item) => item.id !== id),
  });
};

export const clearCart = () => {
  setCartState(emptyState);
};

export const useCart = () => {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return {
    ...snapshot,
    addItem: addCartItem,
    updateQuantity: updateCartItemQuantity,
    removeItem: removeCartItem,
    clearCart,
  };
};