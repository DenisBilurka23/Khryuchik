"use client";

import { useEffect } from "react";

import type { MediaEngineHost } from "@/types/media-player";
import { pickPreferredAudioTrack } from "@/utils";

import type { UsePreferredAudioTrackOptions } from "./usePreferredAudioTrack.types";

export const usePreferredAudioTrack = ({
  videoRef,
  locale,
}: UsePreferredAudioTrackOptions) => {
  useEffect(() => {
    const audioTracks = (videoRef.current as MediaEngineHost | null)
      ?.audioTracks;

    if (!audioTracks) {
      return;
    }

    let isApplied = false;

    const applyPreferredTrack = () => {
      if (isApplied) {
        return;
      }

      const preferred = pickPreferredAudioTrack([...audioTracks], locale);

      if (!preferred) {
        return;
      }

      isApplied = true;

      if (!preferred.enabled) {
        preferred.enabled = true;
      }
    };

    applyPreferredTrack();
    audioTracks.addEventListener("addtrack", applyPreferredTrack);

    return () =>
      audioTracks.removeEventListener("addtrack", applyPreferredTrack);
  }, [videoRef, locale]);
};
