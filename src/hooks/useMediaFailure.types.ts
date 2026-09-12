import type { RefObject } from "react";

export type UseMediaFailureOptions = {
  videoRef: RefObject<HTMLMediaElement | null>;
  timeoutMs: number;
};
