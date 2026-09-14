import type { RefObject } from "react";

export type UseMediaCueStylesOptions = {
  videoRef: RefObject<HTMLElement | null>;
  isEnabled: boolean;
  fontScale: number;
};
