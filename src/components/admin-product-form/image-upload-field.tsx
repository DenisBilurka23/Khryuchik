"use client";

import { useEffect, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import type { AdminImageUploadFieldProps, PreviewImage } from "./types";

export const AdminImageUploadField = ({
  name,
  buttonLabel,
  helperText,
  thumbnailLabel,
  galleryLabel,
  existingImages,
}: AdminImageUploadFieldProps) => {
  const [previewImages, setPreviewImages] = useState<PreviewImage[]>([]);

  useEffect(() => {
    return () => {
      previewImages.forEach((image) => {
        if (image.src) {
          URL.revokeObjectURL(image.src);
        }
      });
    };
  }, [previewImages]);

  const imagesToRender = previewImages.length > 0
    ? previewImages
    : existingImages.map((image) => ({
        id: image.id,
        src: image.src,
        alt: image.alt ?? image.id,
        emoji: image.emoji,
        bgColor: image.bgColor,
      }));

  return (
    <Stack gap={1.5}>
      <Typography variant="body2" color="text.secondary">
        {helperText}
      </Typography>

      {imagesToRender.length > 0 ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(112px, 1fr))", gap: 1.5 }}>
          {imagesToRender.map((image, index) => (
            <Paper
              key={image.id}
              variant="outlined"
              sx={{
                p: 1,
                borderRadius: "18px",
                borderColor: index === 0 ? "#D96C82" : "#E8D6BF",
              }}
            >
              <Typography variant="caption" sx={{ display: "block", mb: 0.75, fontWeight: 700 }}>
                {index === 0 ? thumbnailLabel : `${galleryLabel} ${index}`}
              </Typography>
              <Box
                sx={{
                  height: 96,
                  borderRadius: "14px",
                  bgcolor: image.bgColor ?? "#FFF8F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  fontSize: 32,
                }}
              >
                {image.src ? (
                  <Box component="img" src={image.src} alt={image.alt} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  image.emoji ?? "🖼️"
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      ) : null}

      <Button component="label" variant="outlined" sx={{ alignSelf: "flex-start" }}>
        {buttonLabel}
        <input
          hidden
          type="file"
          name={name}
          accept="image/*"
          multiple
          onChange={(event) => {
            const nextPreviewImages = Array.from(event.target.files ?? []).map((file, index) => ({
              id: `${file.name}-${index}`,
              src: URL.createObjectURL(file),
              alt: file.name,
            }));

            setPreviewImages((currentPreviewImages) => {
              currentPreviewImages.forEach((image) => {
                if (image.src) {
                  URL.revokeObjectURL(image.src);
                }
              });

              return nextPreviewImages;
            });
          }}
        />
      </Button>
    </Stack>
  );
};