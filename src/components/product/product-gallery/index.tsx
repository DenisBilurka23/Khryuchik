"use client";

import { Box, Grid, Paper } from "@mui/material";
import Image from "next/image";
import { useTranslations } from "next-intl";

import { useProductGallery } from "@/hooks/useProductGallery";

import type { ProductGalleryProps } from "../types";
import { ProductGalleryLightbox } from "./lightbox";

const stageSizes = "(max-width: 899px) 100vw, 600px";

const thumbSizes = "(max-width: 899px) 25vw, 150px";

const stageSx = {
  position: "relative",
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
  position: "relative",
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
          <Image
            src={activeImage.src}
            alt={activeImage.alt ?? activeImage.id}
            fill
            sizes={stageSizes}
            preload
            style={{ objectFit: "contain" }}
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
                <Image
                  src={image.src}
                  alt={image.alt ?? image.id}
                  fill
                  sizes={thumbSizes}
                  style={{ objectFit: "cover" }}
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
