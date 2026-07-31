"use client";

import { useState } from "react";

import type {
  UseProductPublishTogglesArgs,
  UseProductPublishTogglesResult,
} from "./useProductPublishToggles.types";

const buildInitialLocaleState = ({
  payload,
  localeCodes,
  defaultLocale,
  isNew,
}: UseProductPublishTogglesArgs): Record<string, boolean> =>
  Object.fromEntries(
    localeCodes.map((code) => {
      if (code === defaultLocale) {
        return [code, true];
      }

      if (isNew) {
        return [code, true];
      }

      // An existing product is "published" in a language when its title was
      // filled in; empty placeholder translations stay toggled off.
      const hasContent = Boolean(
        payload.product.translations[code]?.title?.trim(),
      );

      return [code, hasContent];
    }),
  );

const buildInitialRegionState = ({
  payload,
  regionCodes,
  isNew,
}: UseProductPublishTogglesArgs): Record<string, boolean> => {
  const available = payload.product.availableRegions;

  return Object.fromEntries(
    regionCodes.map((code) => {
      if (isNew) {
        return [code, true];
      }

      return [code, available.includes(code)];
    }),
  );
};

export const useProductPublishToggles = (
  args: UseProductPublishTogglesArgs,
): UseProductPublishTogglesResult => {
  const { defaultLocale } = args;
  const [activeLocales, setActiveLocales] = useState<Record<string, boolean>>(
    () => buildInitialLocaleState(args),
  );
  const [activeRegions, setActiveRegions] = useState<Record<string, boolean>>(
    () => buildInitialRegionState(args),
  );

  const toggleLocale = (code: string) => {
    // The default locale is the storefront fallback source, so it stays on.
    if (code === defaultLocale) {
      return;
    }

    setActiveLocales((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  const toggleRegion = (code: string) => {
    setActiveRegions((prev) => ({ ...prev, [code]: !prev[code] }));
  };

  return {
    activeLocales,
    activeRegions,
    toggleLocale,
    toggleRegion,
    isLocaleActive: (code) =>
      code === defaultLocale ? true : Boolean(activeLocales[code]),
  };
};
