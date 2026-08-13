"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { quoteShippingClient } from "@/client-api/shipping";
import type { ShippingQuoteResponse } from "@/types/order";

import type {
  ShippingQuoteStatus,
  UseShippingQuoteParams,
  UseShippingQuoteResult,
} from "./useShippingQuote.types";

const QUOTE_DEBOUNCE_MS = 600;

type QuoteState = {
  key: string;
  status: Exclude<ShippingQuoteStatus, "idle" | "loading">;
  shipping: number | null;
};

export const useShippingQuote = ({
  locale,
  items,
  address,
  isEnabled,
}: UseShippingQuoteParams): UseShippingQuoteResult => {
  const [result, setResult] = useState<QuoteState | null>(null);

  // The cart array and the address object are rebuilt on every render, so the
  // request keys off their contents and reads the current values from a ref.
  const itemsKey = useMemo(
    () =>
      items
        .map(
          (item) =>
            `${item.productId}:${item.quantity}:${JSON.stringify(item.selections ?? {})}`,
        )
        .join("|"),
    [items],
  );
  const addressKey = useMemo(
    () => (address ? JSON.stringify(address) : ""),
    [address],
  );

  const isQuotable = isEnabled && Boolean(addressKey) && Boolean(itemsKey);
  const requestKey = isQuotable ? `${locale}|${itemsKey}|${addressKey}` : "";

  const latestInput = useRef({ items, address });

  useEffect(() => {
    latestInput.current = { items, address };
  });

  useEffect(() => {
    if (!requestKey) {
      return;
    }

    const abortController = new AbortController();
    const timer = setTimeout(async () => {
      const { items: currentItems, address: currentAddress } =
        latestInput.current;

      if (!currentAddress) {
        return;
      }

      try {
        const response = await quoteShippingClient(
          { locale, items: currentItems, address: currentAddress },
          { signal: abortController.signal },
        );

        if (abortController.signal.aborted) {
          return;
        }

        const payload = response.data as ShippingQuoteResponse | null;

        if (!response.ok || !payload) {
          setResult({ key: requestKey, status: "unavailable", shipping: null });
          return;
        }

        setResult({
          key: requestKey,
          status: payload.status,
          shipping: payload.status === "ok" ? payload.shipping : null,
        });
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Shipping quote failed", error);
          setResult({ key: requestKey, status: "unavailable", shipping: null });
        }
      }
    }, QUOTE_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      abortController.abort();
    };
  }, [locale, requestKey]);

  if (!isQuotable) {
    return { status: "idle", shipping: null };
  }

  if (result?.key !== requestKey) {
    return { status: "loading", shipping: null };
  }

  return { status: result.status, shipping: result.shipping };
};
