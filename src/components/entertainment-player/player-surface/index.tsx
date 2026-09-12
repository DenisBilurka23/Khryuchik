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
  MediaAudioTrackMenu,
  MediaAudioTrackMenuButton,
  MediaCaptionsMenu,
  MediaCaptionsMenuButton,
  MediaRenditionMenu,
  MediaRenditionMenuButton,
} from "media-chrome/react/menu";
import { setLanguage } from "media-chrome/utils/i18n";
import { type CSSProperties, useRef } from "react";

import { ENTERTAINMENT_PLAYER_ABR_INITIAL_ESTIMATE } from "@/constants/entertainment";
import { useHlsPlayback } from "@/hooks/useHlsPlayback";
import { useMediaFailure } from "@/hooks/useMediaFailure";
import { useMediaFullscreenGesture } from "@/hooks/useMediaFullscreenGesture";
import { usePreferredAudioTrack } from "@/hooks/usePreferredAudioTrack";
import { displayFont, leadSx } from "@/theme/sx";

import type { PlayerSurfaceProps } from "../types";

import { rememberQualityLevel } from "./utils";

const HLS_CONFIG = {
  abrEwmaDefaultEstimate: ENTERTAINMENT_PLAYER_ABR_INITIAL_ESTIMATE,
};

const RENDITION_MENU_ID = "entertainment-rendition-menu";

const AUDIO_MENU_ID = "entertainment-audio-menu";

const CAPTIONS_MENU_ID = "entertainment-captions-menu";

const STALL_TIMEOUT_MS = 12_000;

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
    aspectRatio: "var(--player-aspect, 16 / 9)",
    maxHeight: "62vh",
    marginInline: "auto",
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

  "& media-chrome-menu-item": {
    "--media-menu-item-outline": "none",
    "--media-menu-item-focus-shadow": "none",
    "--media-menu-item-hover-background": "var(--color-player-control-hover)",
  },

  "& media-chrome-menu-item:focus-visible": {
    background: "var(--color-player-control-hover)",
  },

  "& media-play-button, & media-mute-button, & media-pip-button, & media-fullscreen-button, & media-rendition-menu-button, & media-audio-track-menu-button, & media-captions-menu-button":
    {
      width: "40px",
      height: "40px",
      borderRadius: "var(--radius-pill)",
      "--media-button-padding": "0px",
    },

  "& media-rendition-menu, & media-audio-track-menu, & media-captions-menu": {
    position: "absolute",
    right: "18px",
    bottom: "58px",
    margin: 0,
  },

  "& media-rendition-menu[hidden], & media-audio-track-menu[hidden], & media-captions-menu[hidden]":
    {
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
  aspectRatio: "var(--player-aspect, 16 / 9)",
  px: 3,
  borderRadius: "var(--radius-panel)",
  background: "var(--color-text)",
  textAlign: "center",
  color: "var(--color-card)",
} as const;

export const PlayerSurface = ({
  playlistUrl,
  aspectRatio,
  poster,
  title,
  locale,
  subtitles,
  qualityLabel,
  audioLabel,
  captionsLabel,
  errorTitle,
  errorText,
}: PlayerSurfaceProps) => {
  const videoRef = useRef<HlsVideoElement | null>(null);
  const aspectStyle = { "--player-aspect": aspectRatio } as CSSProperties;
  const hasSubtitles = Boolean(subtitles?.length);

  setLanguage(locale);

  useHlsPlayback({
    videoRef,
    playlistUrl,
    config: HLS_CONFIG,
    onLevelChange: rememberQualityLevel,
  });

  const hasFailed = useMediaFailure({
    videoRef,
    timeoutMs: STALL_TIMEOUT_MS,
  });

  useMediaFullscreenGesture({ videoRef });

  usePreferredAudioTrack({ videoRef, locale });

  if (hasFailed) {
    return (
      <Box sx={errorFrameSx} style={aspectStyle}>
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
    <Box sx={playerSx} style={aspectStyle}>
      <MediaController>
        <HlsVideo
          ref={videoRef}
          slot="media"
          poster={poster}
          aria-label={title}
          autoplay
          playsInline
          crossOrigin={hasSubtitles ? "anonymous" : undefined}
        >
          {subtitles?.map((subtitle) => (
            <track
              key={subtitle.id}
              kind="subtitles"
              src={subtitle.url}
              srcLang={subtitle.language}
              label={subtitle.label}
            />
          ))}
        </HlsVideo>

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

          {hasSubtitles ? (
            <MediaCaptionsMenuButton
              invokeTarget={CAPTIONS_MENU_ID}
              aria-label={captionsLabel}
            />
          ) : null}
          <MediaAudioTrackMenuButton
            invokeTarget={AUDIO_MENU_ID}
            aria-label={audioLabel}
          />
          <MediaRenditionMenuButton
            invokeTarget={RENDITION_MENU_ID}
            aria-label={qualityLabel}
          />
          <MediaPipButton />
          <MediaFullscreenButton />
        </MediaControlBar>

        {hasSubtitles ? (
          <MediaCaptionsMenu id={CAPTIONS_MENU_ID} anchor="auto" hidden />
        ) : null}
        <MediaAudioTrackMenu id={AUDIO_MENU_ID} anchor="auto" hidden />
        <MediaRenditionMenu id={RENDITION_MENU_ID} anchor="auto" hidden />
      </MediaController>
    </Box>
  );
};
