"use client";

import { useEffect, useMemo, useState } from "react";

import { resolveCartClient } from "@/client-api/cart";
import type { Locale } from "@/i18n/config";
import type {
  CartItem,
  CartResolveResponse,
  StoredCartItem,
} from "@/types/cart";
import type { CountryCode } from "@/utils";

import { removeCartItems, useCart } from "@/stores/cart";

export const useResolvedCart = (
  locale: Locale,
  country: CountryCode,
  itemsOverride?: StoredCartItem[],
) => {
  const cart = useCart();
  const storedItems = itemsOverride ?? cart.items;
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPricingUnavailable, setIsPricingUnavailable] = useState(false);
  const [regionBlockedCount, setRegionBlockedCount] = useState(0);
  const [hasResolved, setHasResolved] = useState(false);

  useEffect(() => {
    if (storedItems.length === 0) {
      setItems([]);
      setIsPricingUnavailable(false);
      setRegionBlockedCount(0);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

    setHasResolved(false);

    const resolveItems = async () => {
      setIsLoading(true);

      try {
        const response = await resolveCartClient(
          {
            locale,
            items: storedItems,
          },
          { signal: abortController.signal },
        );

        if (!response.ok) {
          if (!abortController.signal.aborted) {
            console.error(`Failed to resolve cart: ${response.status}`);
            setItems([]);
            setRegionBlockedCount(0);
          }

          return;
        }

        const payload = response.data as CartResolveResponse | null;

        if (!payload) {
          setItems([]);
          setRegionBlockedCount(0);
          return;
        }

        setItems(payload.items);
        setIsPricingUnavailable(payload.isPricingUnavailable);
        setRegionBlockedCount(payload.regionBlockedItemIds.length);

        if (!itemsOverride) {
          removeCartItems(payload.missingItemIds);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(error);
          setItems([]);
          setRegionBlockedCount(0);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
          setHasResolved(true);
        }
      }
    };

    void resolveItems();

    return () => {
      abortController.abort();
    };
  }, [storedItems, country, locale, itemsOverride]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    ...cart,
    items,
    subtotal,
    isLoading: isLoading || (storedItems.length > 0 && !hasResolved),
    isPricingUnavailable,
    regionBlockedCount,
    hasStoredItems: storedItems.length > 0,
  };
};
