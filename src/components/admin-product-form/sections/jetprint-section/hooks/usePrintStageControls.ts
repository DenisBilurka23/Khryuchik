import { useEffect, useEffectEvent, useRef, useState } from "react";

import {
  PRINT_DESIGN_ARROW_OFFSETS,
  PRINT_DESIGN_NUDGE_FAST_PX,
  PRINT_DESIGN_NUDGE_PX,
  PRINT_DESIGN_WHEEL_ZOOM_STEP,
} from "@/constants/print-design";
import type { PrintDesignLayout } from "@/types/catalog";
import { scaleArtAround } from "@/utils";

import type {
  UsePrintStageControlsOptions,
  UsePrintStageControlsResult,
} from "./usePrintStageControls.types";

export const usePrintStageControls = ({
  template,
  isEnabled,
  layout,
  onLayoutChange,
}: UsePrintStageControlsOptions): UsePrintStageControlsResult => {
  const [stage, setStage] = useState<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    pointerId: number;
    clientX: number;
    clientY: number;
    layout: PrintDesignLayout;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const templateUnitsPerPixel = () => {
    const width = stage?.getBoundingClientRect().width ?? 0;

    return template && width > 0 ? template.width / width : 0;
  };

  const handleWheel = useEffectEvent((event: WheelEvent) => {
    if (!isEnabled || !layout || !template || !stage) {
      return;
    }

    event.preventDefault();

    const rect = stage.getBoundingClientRect();
    const anchor = {
      x: ((event.clientX - rect.left) / rect.width) * template.width,
      y: ((event.clientY - rect.top) / rect.height) * template.height,
    };
    const factor =
      event.deltaY < 0
        ? PRINT_DESIGN_WHEEL_ZOOM_STEP
        : 1 / PRINT_DESIGN_WHEEL_ZOOM_STEP;

    onLayoutChange(scaleArtAround(layout, layout.scale * factor, anchor));
  });

  useEffect(() => {
    if (!stage) {
      return;
    }

    const listener = (event: WheelEvent) => handleWheel(event);

    stage.addEventListener("wheel", listener, { passive: false });

    return () => stage.removeEventListener("wheel", listener);
  }, [stage]);

  return {
    attachStage: setStage,
    isDragging,
    onPointerDown: (event) => {
      if (!isEnabled || !layout || event.button !== 0) {
        return;
      }

      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus();
      dragRef.current = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        layout,
      };
      setIsDragging(true);
    },
    onPointerMove: (event) => {
      const drag = dragRef.current;

      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      const units = templateUnitsPerPixel();

      onLayoutChange({
        ...drag.layout,
        x: drag.layout.x + (event.clientX - drag.clientX) * units,
        y: drag.layout.y + (event.clientY - drag.clientY) * units,
      });
    },
    onPointerUp: (event) => {
      if (dragRef.current?.pointerId === event.pointerId) {
        event.currentTarget.releasePointerCapture(event.pointerId);
        dragRef.current = null;
        setIsDragging(false);
      }
    },
    onKeyDown: (event) => {
      const offset = PRINT_DESIGN_ARROW_OFFSETS[event.key];

      if (!isEnabled || !layout || !offset) {
        return;
      }

      event.preventDefault();

      const step = event.shiftKey
        ? PRINT_DESIGN_NUDGE_FAST_PX
        : PRINT_DESIGN_NUDGE_PX;

      onLayoutChange({
        ...layout,
        x: layout.x + offset[0] * step,
        y: layout.y + offset[1] * step,
      });
    },
  };
};
