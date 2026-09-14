"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type {
  ProductGallerySwipeHandlers,
  UseProductGalleryResult,
} from "./useProductGallery.types";

const SWIPE_THRESHOLD_PX = 48;

export const useProductGallery = (total: number): UseProductGalleryResult => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  const step = useCallback(
    (offset: number) => {
      if (total < 2) {
        return;
      }

      setActiveIndex((current) => (current + offset + total) % total);
    },
    [total],
  );

  const goToNext = useCallback(() => step(1), [step]);
  const goToPrevious = useCallback(() => step(-1), [step]);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        goToNext();
      }

      if (event.key === "ArrowLeft") {
        goToPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrevious, isOpen]);

  const swipeHandlers: ProductGallerySwipeHandlers = {
    onTouchStart: (event) => {
      touchStartXRef.current = event.touches[0]?.clientX ?? null;
    },
    onTouchEnd: (event) => {
      const startX = touchStartXRef.current;
      touchStartXRef.current = null;

      if (startX === null) {
        return;
      }

      const distance = (event.changedTouches[0]?.clientX ?? startX) - startX;

      if (Math.abs(distance) < SWIPE_THRESHOLD_PX) {
        return;
      }

      if (distance < 0) {
        goToNext();
        return;
      }

      goToPrevious();
    },
  };

  return {
    activeIndex,
    isOpen,
    selectIndex: setActiveIndex,
    open,
    close,
    goToNext,
    goToPrevious,
    swipeHandlers,
  };
};
