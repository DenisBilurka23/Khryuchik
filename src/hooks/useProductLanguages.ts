"use client";

import { useCallback, useMemo, useState } from "react";

import type { ProductPrintedStock } from "@/types/catalog";
import type { ShippingHubCode } from "@/types/shipping";

import type {
  UseProductLanguagesArgs,
  UseProductLanguagesResult,
} from "./useProductLanguages.types";

const toLabel = (code: string, adminLocale: string) =>
  new Intl.DisplayNames([adminLocale], { type: "language" }).of(code) ?? code;

export const useProductLanguages = ({
  availableLocales,
  adminLocale,
  initialOptions,
  initialStock,
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

  const toggleLanguage = useCallback((code: string) => {
    setSelected((prev) =>
      prev.includes(code)
        ? prev.filter((entry) => entry !== code)
        : [...prev, code],
    );
  }, []);

  const toggleHub = useCallback((code: string, hub: ShippingHubCode) => {
    setStock((prev) => {
      const current = prev[code] ?? [];

      return {
        ...prev,
        [code]: current.includes(hub)
          ? current.filter((entry) => entry !== hub)
          : [...current, hub],
      };
    });
  }, []);

  const selectedOptions = useMemo(
    () => options.filter((option) => selected.includes(option.value)),
    [options, selected],
  );

  const postedStock = useMemo(
    () =>
      Object.fromEntries(
        selectedOptions
          .map((option) => [option.value, stock[option.value] ?? []] as const)
          .filter(([, hubs]) => hubs.length > 0),
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
    isStocked: useCallback(
      (code: string, hub: ShippingHubCode) =>
        Boolean(stock[code]?.includes(hub)),
      [stock],
    ),
    toggleHub,
    postedStock,
  };
};
