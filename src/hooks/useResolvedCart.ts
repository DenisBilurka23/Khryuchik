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

import { retainCartItems, useCart } from "@/components/cart/store";

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

  useEffect(() => {
    if (storedItems.length === 0) {
      setItems([]);
      setIsPricingUnavailable(false);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

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
          }

          return;
        }

        const payload = response.data as CartResolveResponse | null;

        if (!payload) {
          setItems([]);
          return;
        }

        setItems(payload.items);
        setIsPricingUnavailable(payload.isPricingUnavailable);

        if (!itemsOverride) {
          retainCartItems(payload.items.map((item) => item.id));
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(error);
          setItems([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
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
    isLoading,
    isPricingUnavailable,
    hasStoredItems: storedItems.length > 0,
  };
};
