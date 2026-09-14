"use client";

import { useEffect } from "react";

import { requestFullscreenToggle } from "@/utils/media-player";

import type { UseMediaFullscreenGestureOptions } from "./useMediaFullscreenGesture.types";

export const useMediaFullscreenGesture = ({
  videoRef,
}: UseMediaFullscreenGestureOptions) => {
  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handleDoubleClick = () => requestFullscreenToggle(video);

    video.addEventListener("dblclick", handleDoubleClick);

    return () => video.removeEventListener("dblclick", handleDoubleClick);
  }, [videoRef]);
};
