"use client";

import { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";

import type { ProductGalleryProps } from "../types";

const thumbSx = {
  height: 96,
  borderRadius: "var(--radius-plate)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 36,
  cursor: "pointer",
  overflow: "hidden",
  transition: "border-color .2s ease",
} as const;

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          aspectRatio: "5 / 3",
          borderRadius: "32px",
          border: "1px solid var(--color-border)",
          bgcolor: activeImage?.bgColor || "var(--color-cream)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: { xs: 96, md: 140 },
          overflow: "hidden",
        }}
      >
        {activeImage?.src ? (
          <Box
            component="img"
            src={activeImage.src}
            alt={activeImage.alt ?? activeImage.id}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          activeImage?.emoji
        )}
      </Paper>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((image, index) => (
          <Grid key={image.id} size={{ xs: 3 }}>
            <Paper
              elevation={0}
              onClick={() => setActiveIndex(index)}
              sx={{
                ...thumbSx,
                border:
                  activeIndex === index
                    ? "2px solid var(--color-accent)"
                    : "1px solid var(--color-border)",
                bgcolor: image.bgColor || "var(--color-cream)",
              }}
            >
              {image.src ? (
                <Box
                  component="img"
                  src={image.src}
                  alt={image.alt ?? image.id}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                image.emoji
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
