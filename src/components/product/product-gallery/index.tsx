"use client";

import { Box, Grid, Paper } from "@mui/material";
import { useTranslations } from "next-intl";

import { useProductGallery } from "@/hooks/useProductGallery";

import type { ProductGalleryProps } from "../types";
import { ProductGalleryLightbox } from "./lightbox";

const stageSx = {
  aspectRatio: "5 / 3",
  width: "100%",
  p: 0,
  borderRadius: "32px",
  border: "1px solid var(--color-border)",
  background: "var(--color-cream)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: { xs: 96, md: 140 },
  overflow: "hidden",
  cursor: "zoom-in",
  transition: "border-color .2s ease",
  "&:hover": { borderColor: "var(--color-border-rose)" },
} as const;

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
  const t = useTranslations("storefront.productPage.gallery");
  const {
    activeIndex,
    isOpen,
    selectIndex,
    open,
    close,
    goToNext,
    goToPrevious,
    swipeHandlers,
  } = useProductGallery(images.length);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <Box>
      <Paper
        component="button"
        type="button"
        elevation={0}
        onClick={open}
        aria-label={t("open")}
        sx={stageSx}
        style={
          activeImage?.bgColor ? { background: activeImage.bgColor } : undefined
        }
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
              onClick={() => selectIndex(index)}
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

      <ProductGalleryLightbox
        images={images}
        activeIndex={activeIndex}
        isOpen={isOpen}
        onClose={close}
        onNext={goToNext}
        onPrevious={goToPrevious}
        swipeHandlers={swipeHandlers}
      />
    </Box>
  );
};
