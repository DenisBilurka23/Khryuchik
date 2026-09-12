"use client";

import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import { Box } from "@mui/material";
import dynamic from "next/dynamic";
import { type CSSProperties, useState } from "react";

import type { EntertainmentPlayerProps } from "./types";

const frameSx = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "var(--player-aspect, 16 / 9)",
  maxHeight: "62vh",
  marginInline: "auto",
  borderRadius: "var(--radius-panel)",
  background: "var(--color-text)",
  overflow: "hidden",
} as const;

const loadPlayerSurface = () => import("./player-surface");

const PlayerSurface = dynamic(
  () => loadPlayerSurface().then((module) => module.PlayerSurface),
  { ssr: false, loading: () => <Box sx={frameSx} /> },
);

const posterSx = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
} as const;

const facadeSx = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: 0,
  padding: 0,
  background: "transparent",
  cursor: "pointer",
} as const;

const playBadgeSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 76,
  height: 76,
  borderRadius: "var(--radius-pill)",
  background: "var(--color-card)",
  color: "var(--color-action)",
  boxShadow: "var(--shadow-card)",
  opacity: 0.94,
  transition: "transform 0.2s ease, opacity 0.2s ease",
  "button:hover &": { transform: "scale(1.06)", opacity: 1 },
} as const;

export const EntertainmentPlayer = ({
  playlistUrl,
  aspectRatio,
  poster,
  title,
  locale,
  subtitles,
  playLabel,
  qualityLabel,
  audioLabel,
  captionsLabel,
  errorTitle,
  errorText,
}: EntertainmentPlayerProps) => {
  const [isActive, setIsActive] = useState(false);
  const aspectStyle = { "--player-aspect": aspectRatio } as CSSProperties;

  if (isActive) {
    return (
      <PlayerSurface
        playlistUrl={playlistUrl}
        aspectRatio={aspectRatio}
        poster={poster}
        title={title}
        locale={locale}
        subtitles={subtitles}
        qualityLabel={qualityLabel}
        audioLabel={audioLabel}
        captionsLabel={captionsLabel}
        errorTitle={errorTitle}
        errorText={errorText}
      />
    );
  }

  return (
    <Box sx={frameSx} style={aspectStyle}>
      {poster ? (
        <Box component="img" src={poster} alt={title} sx={posterSx} />
      ) : null}

      <Box
        component="button"
        type="button"
        aria-label={`${playLabel}: ${title}`}
        onPointerEnter={() => void loadPlayerSurface()}
        onClick={() => setIsActive(true)}
        sx={facadeSx}
      >
        <Box sx={playBadgeSx} aria-hidden>
          <PlayArrowRoundedIcon sx={{ fontSize: 44 }} />
        </Box>
      </Box>
    </Box>
  );
};

export type {
  EntertainmentPlayerProps,
  PlayerSubtitleTrack,
  PlayerSurfaceProps,
} from "./types";
