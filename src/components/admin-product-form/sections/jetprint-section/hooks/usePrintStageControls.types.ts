import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";

import type { PrintDesignLayout, PrintDesignSize } from "@/types/catalog";

export type UsePrintStageControlsOptions = {
  template: PrintDesignSize | null;
  isEnabled: boolean;
  layout: PrintDesignLayout | null;
  onLayoutChange: (layout: PrintDesignLayout) => void;
};

export type UsePrintStageControlsResult = {
  attachStage: (element: HTMLDivElement | null) => void;
  isDragging: boolean;
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onPointerUp: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};
