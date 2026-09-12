"use client";

import { useEffect, useLayoutEffect } from "react";

import type {
  HlsEngine,
  HlsLevel,
  HlsLevelEvent,
  MediaEngineHost,
  MediaSourceHost,
} from "@/types/media-player";

import type { UseHlsPlaybackOptions } from "./useHlsPlayback.types";

const MANIFEST_LOADED = "hlsManifestLoaded";

const LEVEL_SWITCHED = "hlsLevelSwitched";

const ENGINE_LOOKUP_FRAMES = 30;

export const useHlsPlayback = ({
  videoRef,
  playlistUrl,
  config,
  onLevelChange,
}: UseHlsPlaybackOptions) => {
  useLayoutEffect(() => {
    const host = videoRef.current as MediaSourceHost | null;

    if (!host) {
      return;
    }

    host.config = config;
    host.src = playlistUrl;
  }, [videoRef, playlistUrl, config]);

  useEffect(() => {
    const host = videoRef.current as MediaEngineHost | null;
    let engine: HlsEngine | null = null;
    let frame = 0;
    let attempts = 0;

    const openAtBestLevel = (_name: string, data?: HlsLevelEvent) => {
      const levels = (data?.levels ?? engine?.levels) as HlsLevel[] | undefined;
      const count = levels?.length ?? 0;

      if (!engine || count === 0) {
        return;
      }

      engine.startLevel = count - 1;
      onLevelChange(levels?.[count - 1]);
    };

    const reportLevel = (_name: string, data?: HlsLevelEvent) => {
      onLevelChange(engine?.levels[data?.level ?? -1]);
    };

    const watchEngine = () => {
      engine = host?.api ?? null;

      if (engine) {
        engine.on(MANIFEST_LOADED, openAtBestLevel);
        engine.on(LEVEL_SWITCHED, reportLevel);
        openAtBestLevel("", undefined);

        return;
      }

      if (attempts < ENGINE_LOOKUP_FRAMES) {
        attempts += 1;
        frame = requestAnimationFrame(watchEngine);
      }
    };

    watchEngine();

    return () => {
      cancelAnimationFrame(frame);
      engine?.off(MANIFEST_LOADED, openAtBestLevel);
      engine?.off(LEVEL_SWITCHED, reportLevel);
    };
  }, [videoRef, onLevelChange]);
};
