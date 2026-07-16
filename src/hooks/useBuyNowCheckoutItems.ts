"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";

import {
  clearBuyNowItem,
  getBuyNowItem,
} from "@/components/cart/buy-now-store";
import type { StoredCartItem } from "@/types/cart";

const subscribe = () => () => {};

const getServerSnapshot = (): StoredCartItem[] | null => null;

export const useBuyNowCheckoutItems = (): StoredCartItem[] | null => {
  const searchParams = useSearchParams();
  const isBuyNow = searchParams.get("buyNow") === "1";

  const snapshotRef = useRef<StoredCartItem[] | null | undefined>(undefined);

  const getSnapshot = (): StoredCartItem[] | null => {
    if (snapshotRef.current === undefined) {
      const item = getBuyNowItem();
      snapshotRef.current = item ? [item] : null;
    }
    return snapshotRef.current ?? null;
  };

  const storedBuyNowItems = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (!isBuyNow) {
      clearBuyNowItem();
    }
  }, [isBuyNow]);

  return isBuyNow ? storedBuyNowItems : null;
};
