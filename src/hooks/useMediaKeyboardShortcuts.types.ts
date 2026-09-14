import type { RefObject } from "react";

export type UseMediaKeyboardShortcutsOptions = {
  videoRef: RefObject<HTMLElement | null>;
  hasSubtitles: boolean;
};

export type UseMediaKeyboardShortcutsResult = {
  fontScale: number;
};
