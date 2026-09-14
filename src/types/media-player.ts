export type MediaAudioTrack = {
  language: string;
  enabled: boolean;
};

export type MediaAudioTrackList = EventTarget & Iterable<MediaAudioTrack>;

export type MediaRenditionList = {
  selectedIndex: number;
};

export type HlsLevel = {
  width: number;
  height: number;
};

export type HlsLevelEvent = {
  level?: number;
  levels?: unknown[];
};

export type HlsListener = (name: string, data?: HlsLevelEvent) => void;

export type HlsEngine = {
  levels: HlsLevel[];
  nextLevel: number;
  startLevel: number;
  autoLevelEnabled: boolean;
  on: (event: string, listener: HlsListener) => void;
  off: (event: string, listener: HlsListener) => void;
};

export type MediaSourceHost = {
  config: Record<string, unknown>;
  src: string;
};

export type MediaTextTrack = {
  kind: string;
  mode: "disabled" | "hidden" | "showing";
};

export type MediaTextTrackList = EventTarget & Iterable<MediaTextTrack>;

export type MediaEngineHost = {
  textTracks?: MediaTextTrackList;
  audioTracks?: MediaAudioTrackList;
  videoRenditions?: MediaRenditionList;
  api?: HlsEngine | null;
};
