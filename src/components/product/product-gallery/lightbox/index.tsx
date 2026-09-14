"use client";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { Box, Dialog, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import { Pill } from "@/components/primitives";

import type { ProductGalleryLightboxProps } from "../../types";

const paperSx = {
  m: { xs: 2, md: 4 },
  p: { xs: 1.5, md: 2 },
  width: "100%",
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-panel)",
  boxShadow: "var(--shadow-floating)",
} as const;

const stageSx = {
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: { xs: "60vh", md: "72vh" },
  borderRadius: "var(--radius-plate)",
  background: "var(--color-cream)",
  overflow: "hidden",
  fontSize: { xs: 120, md: 180 },
  touchAction: "pan-y",
} as const;

const controlSx = {
  position: "absolute",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  padding: 0,
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-card)",
  color: "var(--color-text-secondary)",
  boxShadow: "var(--shadow-card)",
  cursor: "pointer",
  transition: "border-color .2s ease, color .2s ease",
  "&:hover": {
    borderColor: "var(--color-border-rose)",
    color: "var(--color-accent)",
  },
} as const;

const navSx = {
  ...controlSx,
  top: "50%",
  transform: "translateY(-50%)",
} as const;

export const ProductGalleryLightbox = ({
  images,
  activeIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  swipeHandlers,
}: ProductGalleryLightboxProps) => {
  const t = useTranslations("storefront.productPage.gallery");
  const activeImage = images[activeIndex] ?? images[0];
  const hasManyImages = images.length > 1;

  if (!activeImage) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-label={t("title")}
      slotProps={{
        paper: { elevation: 0, sx: paperSx },
        backdrop: { sx: { background: "var(--color-player-scrim)" } },
      }}
    >
      <Box
        sx={stageSx}
        style={
          activeImage.bgColor ? { background: activeImage.bgColor } : undefined
        }
        {...swipeHandlers}
      >
        {activeImage.src ? (
          <Box
            component="img"
            src={activeImage.src}
            alt={activeImage.alt ?? activeImage.id}
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          activeImage.emoji
        )}

        <Box
          component="button"
          type="button"
          onClick={onClose}
          aria-label={t("close")}
          sx={{ ...controlSx, top: 12, right: 12 }}
        >
          <CloseRoundedIcon fontSize="small" />
        </Box>

        {hasManyImages ? (
          <>
            <Box
              component="button"
              type="button"
              onClick={onPrevious}
              aria-label={t("previous")}
              sx={{ ...navSx, left: 12 }}
            >
              <ChevronLeftRoundedIcon />
            </Box>
            <Box
              component="button"
              type="button"
              onClick={onNext}
              aria-label={t("next")}
              sx={{ ...navSx, right: 12 }}
            >
              <ChevronRightRoundedIcon />
            </Box>
          </>
        ) : null}
      </Box>

      {hasManyImages ? (
        <Stack alignItems="center" sx={{ pt: 1.5 }}>
          <Pill aria-live="polite">
            {t("counter", { current: activeIndex + 1, total: images.length })}
          </Pill>
        </Stack>
      ) : null}
    </Dialog>
  );
};
