"use client";

import { useCallback, useRef } from "react";

import { registerEntertainmentView } from "@/client-api/entertainment";
import { ENTERTAINMENT_VIEW_STORAGE_PREFIX } from "@/constants/entertainment";

import type { UseEntertainmentViewResult } from "./useEntertainmentView.types";

const hasStoredView = (slug: string) => {
  try {
    return (
      sessionStorage.getItem(`${ENTERTAINMENT_VIEW_STORAGE_PREFIX}${slug}`) ===
      "1"
    );
  } catch {
    return false;
  }
};

const storeView = (slug: string) => {
  try {
    sessionStorage.setItem(`${ENTERTAINMENT_VIEW_STORAGE_PREFIX}${slug}`, "1");
  } catch {
    return;
  }
};

export const useEntertainmentView = (
  slug: string,
): UseEntertainmentViewResult => {
  const isRegisteredRef = useRef(false);

  return useCallback(() => {
    if (isRegisteredRef.current || !slug) {
      return;
    }

    isRegisteredRef.current = true;

    if (hasStoredView(slug)) {
      return;
    }

    storeView(slug);
    void registerEntertainmentView(slug).catch(() => undefined);
  }, [slug]);
};
