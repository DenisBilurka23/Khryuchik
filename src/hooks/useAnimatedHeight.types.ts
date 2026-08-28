import type { RefObject } from "react";

export type UseAnimatedHeightResult<T extends HTMLElement = HTMLElement> = {
  ref: RefObject<T | null>;
  height: number | undefined;
};
