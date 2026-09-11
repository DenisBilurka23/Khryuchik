"use client";

import { Box, Typography } from "@mui/material";
import type HlsVideoElement from "hls-video-element";
import HlsVideo from "hls-video-element/react";
import {
  MediaControlBar,
  MediaController,
  MediaFullscreenButton,
  MediaMuteButton,
  MediaPipButton,
  MediaPlayButton,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";
import {
  MediaRenditionMenu,
  MediaRenditionMenuButton,
} from "media-chrome/react/menu";
import { addTranslation, setLanguage } from "media-chrome/utils/i18n";
import { useEffect, useRef, useState } from "react";

import { mediaChromeLabelsByLocale } from "@/i18n/media-chrome-labels";
import { displayFont, leadSx } from "@/theme/sx";

import type { PlayerSurfaceProps } from "../types";

const RENDITION_MENU_ID = "entertainment-rendition-menu";

const STALL_TIMEOUT_MS = 12_000;

for (const [locale, labels] of Object.entries(mediaChromeLabelsByLocale)) {
  if (labels) {
    addTranslation(locale, labels);
  }
}

const playerSx = {
  "--media-font-family": "inherit",
  "--media-font-size": "14px",
  "--media-primary-color": "var(--color-card)",
  "--media-secondary-color": "transparent",
  "--media-text-color": "var(--color-card)",
  "--media-control-background": "transparent",
  "--media-control-hover-background": "var(--color-player-control-hover)",
  "--media-control-transition-out": "opacity 0.2s",
  "--media-control-height": "40px",
  "--media-control-padding": "14px",
  "--media-button-icon-width": "20px",
  "--media-button-icon-height": "20px",
  "--media-range-bar-color": "var(--color-accent)",
  "--media-range-track-background": "var(--color-player-track)",
  "--media-range-track-height": "5px",
  "--media-range-track-border-radius": "var(--radius-pill)",
  "--media-range-thumb-background": "var(--color-card)",
  "--media-range-thumb-width": "12px",
  "--media-range-thumb-height": "12px",
  "--media-menu-background": "var(--color-text)",
  "--media-menu-border-radius": "var(--radius-plate)",
  "--media-menu-item-hover-background": "var(--color-player-control-hover)",

  "& media-controller": {
    display: "block",
    width: "100%",
    aspectRatio: "16 / 9",
    borderRadius: "var(--radius-panel)",
    background: "var(--color-text)",
    overflow: "hidden",
  },

  "& media-controller::part(bottom)": {
    background:
      "linear-gradient(to top, var(--color-player-scrim) 16%, transparent)",
  },

  "& media-control-bar": {
    alignItems: "center",
    gap: "4px",
    background: "transparent",
    paddingInline: "18px",
  },

  "& media-control-bar:last-of-type": { paddingBottom: "8px" },

  "@media (max-width: 599.95px)": {
    "& media-control-bar": { paddingInline: "10px" },
    "& media-control-bar:last-of-type": { paddingBottom: "6px" },
  },

  "& media-control-bar:first-of-type": { marginBottom: "2px" },

  "& media-play-button": {
    "--media-button-icon-width": "22px",
    "--media-button-icon-height": "22px",
  },

  "& media-time-range": {
    width: "100%",
    "--media-control-height": "16px",
    "--media-range-padding": "0px",
    "--media-range-thumb-opacity": "0",
    "--media-control-hover-background": "transparent",
  },

  "& media-time-range:hover": {
    "--media-range-track-height": "6px",
    "--media-range-thumb-opacity": "1",
  },

  "& .player-volume": { display: "flex", alignItems: "center" },

  "& .player-volume media-volume-range": {
    width: 0,
    "--media-control-height": "20px",
    "--media-range-padding": "0px",
    overflow: "hidden",
    transition: "width 0.2s ease",
    "--media-range-thumb-opacity": "0",
    "--media-control-hover-background": "transparent",
  },

  "& .player-volume:hover media-volume-range, & .player-volume:focus-within media-volume-range":
    {
      width: "76px",
      "--media-range-thumb-opacity": "1",
    },

  "& .player-spacer": { flex: 1 },

  "& media-play-button, & media-mute-button, & media-pip-button, & media-fullscreen-button, & media-rendition-menu-button":
    {
      width: "40px",
      height: "40px",
      borderRadius: "var(--radius-pill)",
      "--media-button-padding": "0px",
    },

  "& media-rendition-menu[hidden]": {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 0,
    "--media-menu-hidden-max-height": "0px",
  },

  "& media-time-display": {
    padding: "0 2px",
    "--media-control-hover-background": "transparent",
    fontVariantNumeric: "tabular-nums",
    color: "var(--color-card)",
    opacity: 0.9,
  },
} as const;

const errorFrameSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "16 / 9",
  px: 3,
  borderRadius: "var(--radius-panel)",
  background: "var(--color-text)",
  textAlign: "center",
  color: "var(--color-card)",
} as const;

export const PlayerSurface = ({
  playlistUrl,
  poster,
  title,
  locale,
  qualityLabel,
  errorTitle,
  errorText,
}: PlayerSurfaceProps) => {
  const videoRef = useRef<HlsVideoElement | null>(null);
  const [hasFailed, setHasFailed] = useState(false);

  setLanguage(locale);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const handleFailure = () => setHasFailed(true);

    video.addEventListener("error", handleFailure);

    let timer = window.setTimeout(() => {
      if (video.readyState === 0) {
        handleFailure();
      }
    }, STALL_TIMEOUT_MS);

    const cancelTimer = () => {
      window.clearTimeout(timer);
      timer = 0;
    };

    video.addEventListener("loadedmetadata", cancelTimer);
    video.addEventListener("progress", cancelTimer);

    return () => {
      window.clearTimeout(timer);
      video.removeEventListener("error", handleFailure);
      video.removeEventListener("loadedmetadata", cancelTimer);
      video.removeEventListener("progress", cancelTimer);
    };
  }, []);

  if (hasFailed) {
    return (
      <Box sx={errorFrameSx}>
        <Box>
          <Typography
            component="p"
            sx={{ fontFamily: displayFont, fontSize: 26, fontWeight: 600 }}
          >
            {errorTitle}
          </Typography>

          <Typography
            component="p"
            sx={{ ...leadSx, mt: 1.5, color: "var(--color-accent-soft)" }}
          >
            {errorText}
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={playerSx}>
      <MediaController>
        <HlsVideo
          ref={videoRef}
          slot="media"
          src={playlistUrl}
          poster={poster}
          aria-label={title}
          autoplay
          playsInline
        />

        <MediaControlBar>
          <MediaTimeRange />
        </MediaControlBar>

        <MediaControlBar>
          <MediaPlayButton />

          <Box className="player-volume">
            <MediaMuteButton />
            <MediaVolumeRange />
          </Box>

          <MediaTimeDisplay showDuration />

          <Box className="player-spacer" />

          <MediaRenditionMenuButton
            invokeTarget={RENDITION_MENU_ID}
            aria-label={qualityLabel}
          />
          <MediaPipButton />
          <MediaFullscreenButton />
        </MediaControlBar>

        <MediaRenditionMenu id={RENDITION_MENU_ID} anchor="auto" hidden />
      </MediaController>
    </Box>
  );
};
