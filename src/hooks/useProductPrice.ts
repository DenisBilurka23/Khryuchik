"use client";

import { useCallback, useMemo, useState } from "react";

import {
  getVariantSelectionAvailability,
  getVariantValueState,
  isProductVariantAxis,
  resolveOptionPrice,
  resolveVariantSelections,
} from "@/utils";

import type { ProductVariantValueState } from "@/types/product-details";

import type {
  ProductSelectionKey,
  ProductSelectionState,
  UseProductPriceParams,
  UseProductPriceResult,
} from "./useProductPrice.types";

const toInitialSelections = (
  product: UseProductPriceParams["product"],
): ProductSelectionState => {
  const { languages, formats, sizes, colors, variantMatrix } = product;
  const selections = {
    language: languages?.[0]?.value ?? "",
    format: formats?.[0]?.value ?? "",
    size: sizes?.[0]?.value ?? "",
    color: colors?.[0]?.value ?? "",
  };

  return {
    ...selections,
    ...resolveVariantSelections(variantMatrix, product, selections, "size"),
  };
};

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

  const getOptionState = useCallback(
    (key: ProductSelectionKey, value: string): ProductVariantValueState =>
      isProductVariantAxis(key)
        ? getVariantValueState(
            product.variantMatrix,
            product,
            key,
            value,
            selections,
          )
        : { availability: "available", isSelectable: true },
    [product, selections],
  );

  const selectionAvailability = useMemo(
    () => getVariantSelectionAvailability(product.variantMatrix, selections),
    [product, selections],
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

  return {
    selections,
    cartSelections,
    selectOption,
    getOptionState,
    selectionAvailability,
    price,
  };
};
