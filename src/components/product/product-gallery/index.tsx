"use client";

import { useState } from "react";
import { Box, Grid, Paper } from "@mui/material";

import type { ProductGalleryProps } from "../types";

export const ProductGallery = ({ images }: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          height: { xs: 360, md: 520 },
          borderRadius: "32px",
          border: "1px solid #F0DFC8",
          bgcolor: activeImage?.bgColor || "#FFF8F0",
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
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
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
                height: 96,
                borderRadius: "20px",
                border:
                  activeIndex === index
                    ? "2px solid #D96C82"
                    : "1px solid #F0DFC8",
                bgcolor: image.bgColor || "#FFF8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 36,
                cursor: "pointer",
                transition: "all .2s ease",
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