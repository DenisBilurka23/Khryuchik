"use client";

import { useSyncExternalStore } from "react";

import type { CartItem } from "@/types/cart";

type CartState = {
  items: CartItem[];
};

type CartSnapshot = {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
};

type CartItemInput = Omit<CartItem, "id" | "quantity"> & {
  quantity?: number;
};

const STORAGE_KEY = "khryuchik-cart-v1";
const emptyState: CartState = { items: [] };
const emptySnapshot: CartSnapshot = {
  items: [],
  subtotal: 0,
  totalCount: 0,
};

let state = emptyState;
let stateLoaded = false;
let storageListenerAttached = false;
let snapshot: CartSnapshot = emptySnapshot;

const listeners = new Set<() => void>();

const isCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    typeof item.slug === "string" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    typeof item.emoji === "string" &&
    typeof item.quantity === "number" &&
    (typeof item.bgColor === "undefined" || typeof item.bgColor === "string") &&
    (typeof item.variant === "undefined" || typeof item.variant === "string")
  );
};

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const buildSnapshot = (currentState: CartState): CartSnapshot => ({
  items: currentState.items,
  subtotal: currentState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  ),
  totalCount: currentState.items.reduce((sum, item) => sum + item.quantity, 0),
});

const refreshSnapshot = () => {
  snapshot = buildSnapshot(state);
};

const readStateFromStorage = (): CartState => {
  if (typeof window === "undefined") {
    return emptyState;
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return emptyState;
    }

    const parsedValue = JSON.parse(rawValue);
    const items = Array.isArray(parsedValue)
      ? parsedValue.filter(isCartItem)
      : [];

    return { items };
  } catch {
    return emptyState;
  }
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

const buildCartItemId = (slug: string, variant?: string) =>
  variant ? `${slug}::${variant}` : slug;

const createCartItem = ({ quantity = 1, ...item }: CartItemInput): CartItem => ({
  ...item,
  id: buildCartItemId(item.slug, item.variant),
  quantity,
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