"use client";

import { useEffect } from "react";

import type { UseMediaCueStylesOptions } from "./useMediaCueStyles.types";

const buildCueStyles = (fontScale: number) => `
  video::cue {
    background: var(--color-player-cue-veil);
    font-weight: 600;
    font-size: ${Math.round(fontScale * 100)}%;
    text-shadow:
      0 2px 6px var(--color-player-cue-shadow),
      0 0 3px var(--color-player-cue-shadow);
  }
`;

export const useMediaCueStyles = ({
  videoRef,
  isEnabled,
  fontScale,
}: UseMediaCueStylesOptions) => {
  useEffect(() => {
    const shadowRoot = videoRef.current?.shadowRoot;

    if (!shadowRoot || !isEnabled) {
      return;
    }

    const style = document.createElement("style");

    style.textContent = buildCueStyles(fontScale);
    shadowRoot.append(style);

    return () => style.remove();
  }, [videoRef, isEnabled, fontScale]);
};
