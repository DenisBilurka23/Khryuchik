"use client";

import { useCallback, useMemo, useState } from "react";

import { resolveOptionPrice } from "@/utils";

import type {
  ProductSelectionKey,
  ProductSelectionState,
  UseProductPriceParams,
  UseProductPriceResult,
} from "./useProductPrice.types";

const toInitialSelections = ({
  languages,
  formats,
  sizes,
  colors,
}: UseProductPriceParams["product"]): ProductSelectionState => ({
  language: languages?.[0]?.value ?? "",
  format: formats?.[0]?.value ?? "",
  size: sizes?.[0]?.value ?? "",
  color: colors?.[0]?.value ?? "",
});

export const useProductPrice = ({
  product,
  country,
}: UseProductPriceParams): UseProductPriceResult => {
  const [selections, setSelections] = useState<ProductSelectionState>(() =>
    toInitialSelections(product),
  );

  const selectOption = useCallback(
    (key: ProductSelectionKey, value: string) => {
      setSelections((current) => ({ ...current, [key]: value }));
    },
    [],
  );

  const cartSelections = useMemo(
    () => ({
      language: selections.language || undefined,
      format: selections.format || undefined,
      size: selections.size || undefined,
      color: selections.color || undefined,
    }),
    [selections],
  );

  const price = useMemo(
    () => resolveOptionPrice(product.price, product, cartSelections, country),
    [product, cartSelections, country],
  );

  return { selections, cartSelections, selectOption, price };
};
