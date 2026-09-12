import type { RefObject } from "react";

import type { HlsLevel } from "@/types/media-player";

export type UseHlsPlaybackOptions = {
  videoRef: RefObject<HTMLElement | null>;
  playlistUrl: string;
  config: Record<string, unknown>;
  onLevelChange: (level?: HlsLevel) => void;
};
