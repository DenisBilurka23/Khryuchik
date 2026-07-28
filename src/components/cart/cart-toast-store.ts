"use client";

import { useSyncExternalStore } from "react";
import type { CartToastSnapshot } from "./types";

const closedSnapshot: CartToastSnapshot = { open: false, addedCount: 0 };
let snapshot: CartToastSnapshot = closedSnapshot;

const listeners = new Set<() => void>();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): CartToastSnapshot => snapshot;

const getServerSnapshot = (): CartToastSnapshot => closedSnapshot;

export const showCartToast = () => {
  snapshot = { open: true, addedCount: snapshot.addedCount + 1 };
  emitChange();
};

export const hideCartToast = () => {
  if (!snapshot.open) {
    return;
  }

  snapshot = { ...snapshot, open: false };
  emitChange();
};

export const useCartToast = (): CartToastSnapshot =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
