"use client";

import { useSyncExternalStore } from "react";

import { PROMO_STORAGE_KEY } from "@/constants/promo";
import type { OrderPromoCode } from "@/types/order";

let promo: OrderPromoCode | null = null;
let isLoaded = false;

const listeners = new Set<() => void>();

const isStoredPromo = (value: unknown): value is OrderPromoCode =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as OrderPromoCode).code === "string" &&
  typeof (value as OrderPromoCode).percentOff === "number";

const readFromStorage = (): OrderPromoCode | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(PROMO_STORAGE_KEY);
    const parsedValue: unknown = rawValue ? JSON.parse(rawValue) : null;

    return isStoredPromo(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

const persistState = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (promo) {
      window.localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(promo));
    } else {
      window.localStorage.removeItem(PROMO_STORAGE_KEY);
    }
  } catch {}
};

const setPromoState = (nextPromo: OrderPromoCode | null) => {
  promo = nextPromo;
  isLoaded = true;
  persistState();
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): OrderPromoCode | null => {
  if (!isLoaded) {
    promo = readFromStorage();
    isLoaded = true;
  }

  return promo;
};

const getServerSnapshot = (): OrderPromoCode | null => null;

export const setStoredPromo = (nextPromo: OrderPromoCode): void => {
  setPromoState(nextPromo);
};

export const clearStoredPromo = (): void => {
  setPromoState(null);
};

export const useStoredPromo = (): OrderPromoCode | null =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
