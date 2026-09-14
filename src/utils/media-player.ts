import {
  ENTERTAINMENT_CAPTION_SCALES,
  ENTERTAINMENT_CAPTION_SCALE_STORAGE_KEY,
} from "@/constants/entertainment";

import { isDocumentFullscreen } from "./fullscreen";

const TYPING_TAGS = ["INPUT", "TEXTAREA", "SELECT"];

const ENTER_FULLSCREEN_EVENT = "mediaenterfullscreenrequest";

const EXIT_FULLSCREEN_EVENT = "mediaexitfullscreenrequest";

export const requestFullscreenToggle = (target: EventTarget) => {
  target.dispatchEvent(
    new CustomEvent(
      isDocumentFullscreen() ? EXIT_FULLSCREEN_EVENT : ENTER_FULLSCREEN_EVENT,
      { bubbles: true, composed: true },
    ),
  );
};

export const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return TYPING_TAGS.includes(target.tagName) || target.isContentEditable;
};

export const readStoredCaptionScale = () => {
  try {
    const stored = Number(
      window.localStorage.getItem(ENTERTAINMENT_CAPTION_SCALE_STORAGE_KEY),
    );

    return ENTERTAINMENT_CAPTION_SCALES.includes(stored) ? stored : 1;
  } catch {
    return 1;
  }
};

export const storeCaptionScale = (scale: number) => {
  try {
    window.localStorage.setItem(
      ENTERTAINMENT_CAPTION_SCALE_STORAGE_KEY,
      String(scale),
    );
  } catch {
    return;
  }
};
