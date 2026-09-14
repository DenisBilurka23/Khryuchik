import type { TouchEventHandler } from "react";

export type ProductGallerySwipeHandlers = {
  onTouchStart: TouchEventHandler<HTMLElement>;
  onTouchEnd: TouchEventHandler<HTMLElement>;
};

export type UseProductGalleryResult = {
  activeIndex: number;
  isOpen: boolean;
  selectIndex: (index: number) => void;
  open: () => void;
  close: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  swipeHandlers: ProductGallerySwipeHandlers;
};
