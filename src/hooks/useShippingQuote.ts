"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { quoteShippingClient } from "@/client-api/shipping";
import { isPostalCodeValid } from "@/utils";
import type { ShippingQuoteResponse } from "@/types/order";
import type { ShippingQuoteGroup } from "@/types/shipping";

import type {
  ShippingQuoteStatus,
  UseShippingQuoteParams,
  UseShippingQuoteResult,
} from "./useShippingQuote.types";

const QUOTE_DEBOUNCE_MS = 800;

const MIN_QUOTABLE_POSTAL_CODE_LENGTH = 3;

type QuoteState = {
  key: string;
  status: Exclude<ShippingQuoteStatus, "idle" | "loading">;
  shipping: number | null;
  groups: ShippingQuoteGroup[];
};

export const useShippingQuote = ({
  locale,
  items,
  address,
  isEnabled,
  isLocationFieldFocused,
}: UseShippingQuoteParams): UseShippingQuoteResult => {
  const [result, setResult] = useState<QuoteState | null>(null);

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
    () =>
      address?.postalCode &&
      address.postalCode.trim().length >= MIN_QUOTABLE_POSTAL_CODE_LENGTH &&
      isPostalCodeValid(address.postalCode)
        ? [address.country, address.region ?? "", address.postalCode.trim()]
            .join("|")
            .toUpperCase()
        : "",
    [address],
  );

  const isQuotable = isEnabled && Boolean(addressKey) && Boolean(itemsKey);
  const requestKey = isQuotable ? `${locale}|${itemsKey}|${addressKey}` : "";

  const latestInput = useRef({ items, address });
  const requestedKey = useRef("");

  useEffect(() => {
    latestInput.current = { items, address };
  });

  useEffect(() => {
    if (!requestKey || requestedKey.current === requestKey) {
      return;
    }

    const delay = isLocationFieldFocused ? QUOTE_DEBOUNCE_MS : 0;

    const timer = setTimeout(async () => {
      const { items: currentItems, address: currentAddress } =
        latestInput.current;

      if (!currentAddress) {
        return;
      }

      requestedKey.current = requestKey;

      const applyResult = (state: Omit<QuoteState, "key">) => {
        if (requestedKey.current === requestKey) {
          setResult({ key: requestKey, ...state });
        }
      };

      try {
        const response = await quoteShippingClient({
          locale,
          items: currentItems,
          address: currentAddress,
        });

        const payload = response.data as ShippingQuoteResponse | null;

        if (!response.ok || !payload) {
          applyResult({ status: "unavailable", shipping: null, groups: [] });
          return;
        }

        applyResult({
          status: payload.status,
          shipping: payload.status === "ok" ? payload.shipping : null,
          groups: payload.status === "ok" ? payload.groups : [],
        });
      } catch (error) {
        console.error("Shipping quote failed", error);
        applyResult({ status: "unavailable", shipping: null, groups: [] });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [locale, requestKey, isLocationFieldFocused]);

  if (!isQuotable) {
    return { status: "idle", shipping: null, groups: [] };
  }

  if (result?.key !== requestKey) {
    return { status: "loading", shipping: null, groups: [] };
  }

  return {
    status: result.status,
    shipping: result.shipping,
    groups: result.groups,
  };
};
