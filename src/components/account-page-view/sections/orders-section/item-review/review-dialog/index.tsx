"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Alert,
  Button,
  Dialog,
  IconButton,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { IconTile } from "@/components/primitives";
import { displayFont, inputFieldSx } from "@/theme/sx";

import { OrderItemThumbnail } from "../../item-thumbnail";

import type { ReviewDialogProps } from "./types";

const paperSx = {
  position: "relative",
  borderRadius: "var(--radius-panel)",
  bgcolor: "var(--color-card)",
  p: { xs: "28px 20px 24px", sm: "32px 32px 28px" },
} as const;

const closeSx = {
  position: "absolute",
  top: 18,
  right: 18,
  width: 32,
  height: 32,
  bgcolor: "var(--color-cream)",
  color: "var(--color-text-secondary)",
} as const;

const productSx = {
  pb: 2.25,
  mb: 2.75,
  borderBottom: "1px solid var(--color-border)",
} as const;

const titleSx = {
  fontFamily: displayFont,
  fontSize: 26,
  fontWeight: 600,
  lineHeight: 1.2,
} as const;

const subtitleSx = {
  fontSize: 14,
  lineHeight: 1.5,
  color: "var(--color-text-secondary)",
} as const;

const ratingSx = {
  gap: "8px",
  fontSize: 38,
  "& .MuiRating-iconFilled": { color: "var(--color-star)" },
  "& .MuiRating-iconHover": { color: "var(--color-star)" },
  "& .MuiRating-iconEmpty": { color: "var(--color-star-empty)" },
} as const;

const textFieldSx = {
  ...inputFieldSx,
  "& .MuiOutlinedInput-root": {
    ...inputFieldSx["& .MuiOutlinedInput-root"],
    minHeight: 90,
    alignItems: "flex-start",
    paddingBlock: "13px",
  },
} as const;

const submitSx = {
  borderRadius: "var(--radius-pill)",
  py: 1.75,
  fontSize: 15,
} as const;

const confirmIconSx = {
  borderRadius: "var(--radius-pill)",
  width: 56,
  height: 56,
  color: "var(--color-action)",
} as const;

export const ReviewDialog = ({
  isOpen,
  productTitle,
  productType,
  thumbnail,
  caption,
  rating,
  text,
  status,
  errorMessage,
  onRatingChangeAction,
  onTextChangeAction,
  onSubmitAction,
  onCloseAction,
}: ReviewDialogProps) => {
  const t = useTranslations("accountPage.orderReview");

  return (
    <Dialog
      open={isOpen}
      onClose={onCloseAction}
      maxWidth="xs"
      fullWidth
      slotProps={{ paper: { sx: paperSx } }}
    >
      <IconButton aria-label={t("close")} onClick={onCloseAction} sx={closeSx}>
        <CloseRoundedIcon fontSize="small" />
      </IconButton>

      {status === "success" ? (
        <Stack spacing={1} alignItems="center" sx={{ py: 1, px: 0.5 }}>
          <IconTile tone="accent" sx={confirmIconSx}>
            <CheckRoundedIcon />
          </IconTile>
          <Typography component="p" sx={{ ...titleSx, fontSize: 24 }}>
            {t("thanksTitle")}
          </Typography>
          <Typography sx={{ ...subtitleSx, textAlign: "center" }}>
            {t("thanksText")}
          </Typography>
        </Stack>
      ) : (
        <>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={productSx}
          >
            <OrderItemThumbnail {...thumbnail} />
            <Stack spacing={0.25}>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                {productTitle}
              </Typography>
              <Typography
                sx={{ fontSize: 12.5, color: "var(--color-text-muted)" }}
              >
                {caption}
              </Typography>
            </Stack>
          </Stack>

          <Stack spacing={2.5}>
            <Stack spacing={0.75}>
              <Typography component="p" sx={titleSx}>
                {productType === "book" ? t("titleBook") : t("title")}
              </Typography>
              <Typography sx={subtitleSx}>{t("subtitle")}</Typography>
            </Stack>

            <Rating
              value={rating}
              onChange={(_event, value) => onRatingChangeAction(value)}
              sx={ratingSx}
            />

            <TextField
              value={text}
              onChange={(event) => onTextChangeAction(event.target.value)}
              placeholder={t("placeholder")}
              multiline
              minRows={3}
              fullWidth
              sx={textFieldSx}
            />

            {errorMessage ? (
              <Alert
                severity="error"
                sx={{ borderRadius: "var(--radius-card)" }}
              >
                {errorMessage}
              </Alert>
            ) : null}

            <Button
              type="button"
              variant="contained"
              fullWidth
              disabled={!rating || status === "submitting"}
              onClick={onSubmitAction}
              sx={submitSx}
            >
              {status === "submitting" ? t("submitting") : t("submit")}
            </Button>
          </Stack>
        </>
      )}
    </Dialog>
  );
};

export type { ReviewDialogProps } from "./types";
