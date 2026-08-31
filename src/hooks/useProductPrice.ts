"use client";

import { useCallback, useMemo, useState } from "react";

import { BOOK_FORMAT } from "@/constants/catalog";
import {
  getVariantSelectionAvailability,
  getVariantValueState,
  isPrintedOffered,
  isProductVariantAxis,
  isPurchasableAvailability,
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
  const language = languages?.[0]?.value ?? "";
  // Opening on a combination nobody can buy reads as a broken page, so the
  // first format that exists for the first language wins.
  const format =
    formats?.find(
      (option) =>
        option.value !== BOOK_FORMAT.printed ||
        isPrintedOffered(product.printedLanguages, language),
    )?.value ??
    formats?.[0]?.value ??
    "";
  const selections = {
    language,
    format,
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

  const getPrintedState = useCallback(
    (key: ProductSelectionKey, value: string): ProductVariantValueState => {
      const language = key === "language" ? value : selections.language;
      const format = key === "format" ? value : selections.format;

      if (
        format === BOOK_FORMAT.printed &&
        !isPrintedOffered(product.printedLanguages, language)
      ) {
        return { availability: "unavailable", isSelectable: false };
      }

      return { availability: "available", isSelectable: true };
    },
    [product, selections],
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
        : getPrintedState(key, value),
    [getPrintedState, product, selections],
  );

  const selectionAvailability = useMemo(() => {
    if (!isPurchasableAvailability(product.availability)) {
      return "sold-out";
    }

    const variant = getVariantSelectionAvailability(
      product.variantMatrix,
      selections,
    );

    return variant === "available"
      ? getPrintedState("format", selections.format).availability
      : variant;
  }, [getPrintedState, product, selections]);

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
    () =>
      resolveOptionPrice(
        product.price,
        product,
        cartSelections,
        product.currency,
      ),
    [product, cartSelections],
  );

  const oldPrice = useMemo(
    () =>
      product.oldPrice === undefined
        ? undefined
        : resolveOptionPrice(
            product.oldPrice,
            product,
            cartSelections,
            product.currency,
          ),
    [product, cartSelections],
  );

  return {
    selections,
    cartSelections,
    selectOption,
    getOptionState,
    selectionAvailability,
    price,
    oldPrice,
  };
};
