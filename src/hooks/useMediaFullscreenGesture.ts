"use client";

import { useEffect } from "react";

import { isDocumentFullscreen } from "@/utils";

import type { UseMediaFullscreenGestureOptions } from "./useMediaFullscreenGesture.types";

const ENTER_FULLSCREEN_EVENT = "mediaenterfullscreenrequest";

const EXIT_FULLSCREEN_EVENT = "mediaexitfullscreenrequest";

export const useMediaFullscreenGesture = ({
  videoRef,
}: UseMediaFullscreenGestureOptions) => {
  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handleDoubleClick = () => {
      video.dispatchEvent(
        new CustomEvent(
          isDocumentFullscreen()
            ? EXIT_FULLSCREEN_EVENT
            : ENTER_FULLSCREEN_EVENT,
          { bubbles: true, composed: true },
        ),
      );
    };

    video.addEventListener("dblclick", handleDoubleClick);

    return () => video.removeEventListener("dblclick", handleDoubleClick);
  }, [videoRef]);
};
