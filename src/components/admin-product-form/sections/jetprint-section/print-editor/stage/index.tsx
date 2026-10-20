"use client";

import { Box, Typography } from "@mui/material";

import type { AdminPrintEditorStageProps } from "./types";

const stageSx = {
  position: "relative",
  width: "100%",
  overflow: "hidden",
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "common.white",
  touchAction: "none",
  userSelect: "none",
  outline: "none",
  "&:focus-visible": { boxShadow: 3 },
} as const;

const overlaySx = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
} as const;

const artSx = {
  position: "absolute",
  maxWidth: "none",
  pointerEvents: "none",
} as const;

const emptySx = {
  position: "absolute",
  inset: 0,
  display: "grid",
  placeItems: "center",
  p: 3,
  textAlign: "center",
} as const;

export const AdminPrintEditorStage = ({
  template,
  art,
  layout,
  showGuides,
  showCut,
  isArtFaded,
  emptyLabel,
  ariaLabel,
  attachStage,
  isDragging,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
}: AdminPrintEditorStageProps) => {
  const canMove = Boolean(template && art && layout);

  return (
    <Box
      ref={attachStage}
      role="application"
      aria-label={ariaLabel}
      tabIndex={canMove ? 0 : -1}
      sx={stageSx}
      style={{
        aspectRatio: template ? `${template.width} / ${template.height}` : "1",
        cursor: canMove ? (isDragging ? "grabbing" : "grab") : "default",
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      {template && art && layout ? (
        <Box
          component="img"
          src={art.source.url}
          alt=""
          draggable={false}
          sx={artSx}
          style={{
            left: `${(layout.x / template.width) * 100}%`,
            top: `${(layout.y / template.height) * 100}%`,
            width: `${((art.width * layout.scale) / template.width) * 100}%`,
            opacity: isArtFaded ? 0.5 : 1,
          }}
        />
      ) : null}

      {template && showCut ? (
        <Box
          component="img"
          src={template.cutMask.url}
          alt=""
          draggable={false}
          sx={overlaySx}
        />
      ) : null}

      {template && showGuides ? (
        <Box
          component="img"
          src={template.guides.url}
          alt=""
          draggable={false}
          sx={overlaySx}
        />
      ) : null}

      {!template || !art ? (
        <Box sx={emptySx}>
          <Typography variant="body2" color="text.secondary">
            {emptyLabel}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export type { AdminPrintEditorStageProps } from "./types";
