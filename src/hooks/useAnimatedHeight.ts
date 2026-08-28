"use client";

import { useEffect, useRef, useState } from "react";

import type { UseAnimatedHeightResult } from "./useAnimatedHeight.types";

export const useAnimatedHeight = <T extends HTMLElement = HTMLElement>(
  resetKey: string | number,
): UseAnimatedHeightResult<T> => {
  const ref = useRef<T | null>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const measure = () => setHeight(element.getBoundingClientRect().height);

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [resetKey]);

  return { ref, height };
};
