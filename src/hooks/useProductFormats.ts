"use client";

import { useCallback, useMemo, useState } from "react";

import { BOOK_FORMAT } from "@/constants/catalog";
import type { ProductOptionPriceDelta } from "@/types/product-details";

import type {
  UseProductFormatsArgs,
  UseProductFormatsResult,
} from "./useProductFormats.types";

type FormatPriceDeltas = Partial<Record<string, ProductOptionPriceDelta>>;

export const useProductFormats = ({
  initialFormats,
  printedLabel,
  digitalLabel,
}: UseProductFormatsArgs): UseProductFormatsResult => {
  const [selected, setSelected] = useState<string[]>(() =>
    initialFormats.map((format) => format.value),
  );
  const [priceDeltas, setPriceDeltas] = useState<FormatPriceDeltas>(() =>
    Object.fromEntries(
      initialFormats.map((format) => [format.value, format.priceDelta]),
    ),
  );

  const options = useMemo(
    () => [
      { label: printedLabel, value: BOOK_FORMAT.printed },
      { label: digitalLabel, value: BOOK_FORMAT.digital },
    ],
    [printedLabel, digitalLabel],
  );

  const toggleFormat = useCallback((value: string) => {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((entry) => entry !== value)
        : [...prev, value],
    );
  }, []);

  const setPriceDelta = useCallback(
    (value: string, priceDelta?: ProductOptionPriceDelta) => {
      setPriceDeltas((current) => ({ ...current, [value]: priceDelta }));
    },
    [],
  );

  const selectedOptions = useMemo(
    () =>
      options
        .filter((option) => selected.includes(option.value))
        .map((option) => ({
          ...option,
          priceDelta: priceDeltas[option.value],
        })),
    [options, selected, priceDeltas],
  );

  return {
    options,
    selectedOptions,
    isFormatSelected: useCallback(
      (value: string) => selected.includes(value),
      [selected],
    ),
    toggleFormat,
    setPriceDelta,
  };
};
