"use client";

import { useCallback, useMemo, useState } from "react";

import { DEFAULT_BOOK_STOCK } from "@/constants/catalog";
import { SHIPPING_HUB_CODES } from "@/constants/shipping";
import type { ProductHubStock, ProductPrintedStock } from "@/types/catalog";
import type { ShippingHubCode } from "@/types/shipping";

import type {
  UseProductLanguagesArgs,
  UseProductLanguagesResult,
} from "./useProductLanguages.types";

const toLabel = (code: string, adminLocale: string) =>
  new Intl.DisplayNames([adminLocale], { type: "language" }).of(code) ?? code;

const seedStock: ProductHubStock = Object.fromEntries(
  SHIPPING_HUB_CODES.map((hub) => [hub, DEFAULT_BOOK_STOCK]),
);

export const useProductLanguages = ({
  availableLocales,
  adminLocale,
  initialOptions,
  initialStock,
  isNew,
}: UseProductLanguagesArgs): UseProductLanguagesResult => {
  const [selected, setSelected] = useState<string[]>(() =>
    initialOptions.map((option) => option.value),
  );
  const [stock, setStock] = useState<ProductPrintedStock>(initialStock);

  const options = useMemo(
    () =>
      availableLocales.map((locale) => ({
        label: toLabel(locale.code, adminLocale),
        value: locale.code,
      })),
    [availableLocales, adminLocale],
  );

  const toggleLanguage = useCallback(
    (code: string) => {
      setSelected((prev) =>
        prev.includes(code)
          ? prev.filter((entry) => entry !== code)
          : [...prev, code],
      );

      if (isNew) {
        setStock((prev) =>
          prev[code] ? prev : { ...prev, [code]: seedStock },
        );
      }
    },
    [isNew],
  );

  const setHubStock = useCallback(
    (code: string, hub: ShippingHubCode, quantity: number) => {
      setStock((prev) => ({
        ...prev,
        [code]: { ...prev[code], [hub]: Math.max(0, Math.trunc(quantity)) },
      }));
    },
    [],
  );

  const selectedOptions = useMemo(
    () => options.filter((option) => selected.includes(option.value)),
    [options, selected],
  );

  const postedStock = useMemo(
    () =>
      Object.fromEntries(
        selectedOptions.flatMap((option) => {
          const hubStock = stock[option.value];

          return hubStock ? [[option.value, hubStock] as const] : [];
        }),
      ),
    [selectedOptions, stock],
  );

  return {
    options,
    selectedOptions,
    isLanguageSelected: useCallback(
      (code: string) => selected.includes(code),
      [selected],
    ),
    toggleLanguage,
    getHubStock: useCallback(
      (code: string, hub: ShippingHubCode) => stock[code]?.[hub] ?? 0,
      [stock],
    ),
    setHubStock,
    postedStock,
  };
};
