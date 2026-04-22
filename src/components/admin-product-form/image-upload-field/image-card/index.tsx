"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, IconButton, Paper, Typography } from "@mui/material";

import type { ImageCardProps } from "../types";
import styles from "../styles.module.css";

const getImageCardStyles = ({
  isPrimary,
  isDragging,
  isOverlay,
}: {
  isPrimary: boolean;
  isDragging: boolean;
  isOverlay: boolean;
}) => ({
  p: 1,
  borderRadius: "18px",
  borderColor: isPrimary ? "#D96C82" : "#E8D6BF",
  opacity: isDragging && !isOverlay ? 0.2 : 1,
  boxShadow: isOverlay
    ? "0 22px 42px rgba(217, 108, 130, 0.28)"
    : isDragging
      ? "0 16px 30px rgba(217, 108, 130, 0.18)"
      : "0 6px 18px rgba(120, 90, 70, 0.08)",
  transform: isOverlay ? "rotate(-2deg) scale(1.04)" : "none",
  transition:
    "box-shadow 180ms ease, border-color 180ms ease, opacity 180ms ease, transform 180ms ease",
  willChange: "transform",
  userSelect: "none",
  position: "relative",
  overflow: "hidden",
});

export const ImageCard = ({
  image,
  index,
  thumbnailLabel,
  galleryLabel,
  removeButtonLabel,
  onRemove,
  isDragging = false,
  isOverlay = false,
  dragHandleListeners,
  dragHandleAttributes,
}: ImageCardProps) => {
  return (
    <Paper
      variant="outlined"
      className={isDragging || isOverlay ? styles.draggingCard : styles.draggableCard}
      {...dragHandleAttributes}
      {...dragHandleListeners}
      sx={getImageCardStyles({
        isPrimary: index === 0,
        isDragging,
        isOverlay,
      })}
    >
      <Box className={styles.header}>
        <Typography variant="caption" sx={{ display: "block", fontWeight: 700 }}>
          {index === 0 ? thumbnailLabel : `${galleryLabel} ${index}`}
        </Typography>
        <Box className={styles.actions}>
          {!isOverlay && onRemove ? (
            <IconButton
              type="button"
              size="small"
              aria-label={removeButtonLabel}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.stopPropagation();
                onRemove();
              }}
              className={styles.removeButton}
            >
              <CloseRoundedIcon sx={{ fontSize: 16 }} />
            </IconButton>
          ) : null}
          <Box
            aria-hidden
            className={styles.dragHandle}
            sx={{ cursor: "inherit" }}
          >
            {Array.from({ length: 6 }).map((_, dotIndex) => (
              <Box
                key={dotIndex}
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "999px",
                  bgcolor: "text.secondary",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
      <Box className={styles.imageFrame} sx={{ bgcolor: image.bgColor ?? "#FFF8F0" }}>
        {image.src ? (
          <Box component="img" src={image.src} alt={image.alt} className={styles.image} />
        ) : (
          image.emoji ?? "🖼️"
        )}
      </Box>
    </Paper>
  );
};