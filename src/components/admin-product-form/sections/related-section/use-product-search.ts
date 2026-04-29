"use client";

import { useEffect, useRef, useState } from "react";

import { searchAdminProductsClient } from "@/client-api/admin";
import type { Locale } from "@/i18n/config";
import type { AdminProductOption } from "@/types/admin";

const SEARCH_DEBOUNCE_MS = 350;

type UseProductSearchInput = {
  locale: Locale;
  query: string;
  excludeProductId: string;
  fallbackOptions: AdminProductOption[];
};

export const useProductSearch = ({
  locale,
  query,
  excludeProductId,
  fallbackOptions,
}: UseProductSearchInput) => {
  const [options, setOptions] = useState(fallbackOptions);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setOptions(fallbackOptions);
  }, [fallbackOptions]);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setIsLoading(false);
      setOptions(fallbackOptions);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      const currentRequestId = requestIdRef.current + 1;
      requestIdRef.current = currentRequestId;
      setIsLoading(true);

      searchAdminProductsClient({
        locale,
        query: trimmedQuery,
        excludeProductId,
        limit: 10,
      })
        .then((response) => {
          if (requestIdRef.current !== currentRequestId) {
            return;
          }

          if (!response.ok) {
            throw new Error("Failed to load products");
          }

          setOptions(response.data?.items ?? []);
        })
        .catch(() => {
          if (requestIdRef.current !== currentRequestId) {
            return;
          }

          setOptions(fallbackOptions);
        })
        .finally(() => {
          if (requestIdRef.current === currentRequestId) {
            setIsLoading(false);
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [excludeProductId, fallbackOptions, locale, query]);

  return { options, isLoading };
};