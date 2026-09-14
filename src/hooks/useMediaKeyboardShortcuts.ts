"use client";

import { useCallback, useEffect, useState } from "react";

import { ENTERTAINMENT_CAPTION_SCALES } from "@/constants/entertainment";
import type { MediaEngineHost, MediaTextTrack } from "@/types/media-player";
import {
  isTypingTarget,
  readStoredCaptionScale,
  requestFullscreenToggle,
  storeCaptionScale,
} from "@/utils/media-player";

import type {
  UseMediaKeyboardShortcutsOptions,
  UseMediaKeyboardShortcutsResult,
} from "./useMediaKeyboardShortcuts.types";

const isSubtitleTrack = (track: MediaTextTrack) =>
  track.kind === "subtitles" || track.kind === "captions";

export const useMediaKeyboardShortcuts = ({
  videoRef,
  hasSubtitles,
}: UseMediaKeyboardShortcutsOptions): UseMediaKeyboardShortcutsResult => {
  const [fontScale, setFontScale] = useState(readStoredCaptionScale);

  const stepScale = useCallback((direction: number) => {
    setFontScale((current) => {
      const index = ENTERTAINMENT_CAPTION_SCALES.indexOf(current);
      const fallback = ENTERTAINMENT_CAPTION_SCALES.indexOf(1);
      const nextIndex = Math.min(
        Math.max((index === -1 ? fallback : index) + direction, 0),
        ENTERTAINMENT_CAPTION_SCALES.length - 1,
      );
      const next = ENTERTAINMENT_CAPTION_SCALES[nextIndex] ?? current;

      storeCaptionScale(next);

      return next;
    });
  }, []);

  const toggleCaptions = useCallback(() => {
    const textTracks = (videoRef.current as MediaEngineHost | null)?.textTracks;

    if (!textTracks) {
      return;
    }

    const tracks = [...textTracks].filter(isSubtitleTrack);
    const shown = tracks.find((track) => track.mode === "showing");

    if (shown) {
      shown.mode = "disabled";

      return;
    }

    const next = tracks[0];

    if (next) {
      next.mode = "showing";
    }
  }, [videoRef]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }

      if (event.code === "KeyF") {
        event.preventDefault();
        requestFullscreenToggle(video);

        return;
      }

      if (!hasSubtitles) {
        return;
      }

      if (event.code === "KeyC") {
        event.preventDefault();
        toggleCaptions();

        return;
      }

      if (event.code === "Equal" || event.code === "NumpadAdd") {
        event.preventDefault();
        stepScale(1);

        return;
      }

      if (event.code === "Minus" || event.code === "NumpadSubtract") {
        event.preventDefault();
        stepScale(-1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [videoRef, hasSubtitles, stepScale, toggleCaptions]);

  return { fontScale };
};
