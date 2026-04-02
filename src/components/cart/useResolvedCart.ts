"use client";

import { useEffect, useMemo, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";
import type { CartItem, CartResolveResponse } from "@/types/cart";

import { useCart } from "./store";

export const useResolvedCart = (locale: Locale, country: CountryCode) => {
  const cart = useCart();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (cart.items.length === 0) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const abortController = new AbortController();

    const resolveItems = async () => {
      setIsLoading(true);

      try {
        const response = await fetch("/api/cart/resolve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            locale,
            items: cart.items,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          if (!abortController.signal.aborted) {
            console.error(`Failed to resolve cart: ${response.status}`);
            setItems([]);
          }

          return;
        }

        const payload = (await response.json()) as CartResolveResponse;

        setItems(payload.items);
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
  }, [cart.items, country, locale]);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    ...cart,
    items,
    subtotal,
    isLoading,
    hasStoredItems: cart.items.length > 0,
  };
};