"use client";

import { useEffect, useState } from "react";

import type { UseMediaFailureOptions } from "./useMediaFailure.types";

export const useMediaFailure = ({
  videoRef,
  timeoutMs,
}: UseMediaFailureOptions) => {
  const [hasFailed, setHasFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handleFailure = () => setHasFailed(true);

    video.addEventListener("error", handleFailure);

    const timer = window.setTimeout(() => {
      if (video.readyState === 0) {
        handleFailure();
      }
    }, timeoutMs);

    const cancelTimer = () => window.clearTimeout(timer);

    video.addEventListener("loadedmetadata", cancelTimer);
    video.addEventListener("progress", cancelTimer);

    return () => {
      window.clearTimeout(timer);
      video.removeEventListener("error", handleFailure);
      video.removeEventListener("loadedmetadata", cancelTimer);
      video.removeEventListener("progress", cancelTimer);
    };
  }, [videoRef, timeoutMs]);

  return hasFailed;
};
