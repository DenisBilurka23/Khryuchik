"use client";

import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import {
  Button,
  CircularProgress,
  Dialog,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { IconTile } from "@/components/primitives";
import { displayFont } from "@/theme/sx";

import type { ConfirmDeliveryDialogProps } from "./types";

const paperSx = {
  width: "100%",
  maxWidth: 500,
  borderRadius: "var(--radius-plate)",
  bgcolor: "var(--color-page)",
  p: { xs: "28px 22px 24px", sm: "36px 36px 30px" },
} as const;

const iconSx = {
  borderRadius: "var(--radius-pill)",
  width: 52,
  height: 52,
  color: "var(--color-action)",
  mb: 2.25,
} as const;

const titleSx = {
  fontFamily: displayFont,
  fontSize: 25,
  fontWeight: 600,
  lineHeight: 1.2,
  mb: 1.25,
} as const;

const descriptionSx = {
  fontSize: 14.5,
  lineHeight: 1.6,
  color: "var(--color-text-secondary)",
  mb: 3.25,
} as const;

const actionSx = {
  flex: 1,
  py: "13px",
  fontSize: 14.5,
  whiteSpace: "nowrap",
  borderRadius: "var(--radius-pill)",
} as const;

const cancelSx = {
  ...actionSx,
  border: "1.5px solid var(--color-border)",
  bgcolor: "var(--color-white)",
  color: "var(--color-text-secondary)",
  "&:hover": {
    border: "1.5px solid var(--color-border)",
    bgcolor: "var(--color-cream)",
  },
} as const;

export const ConfirmDeliveryDialog = ({
  isOpen,
  isSubmitting,
  onConfirmAction,
  onCloseAction,
}: ConfirmDeliveryDialogProps) => {
  const t = useTranslations("accountPage.confirmDelivery");

  return (
    <Dialog
      open={isOpen}
      onClose={onCloseAction}
      maxWidth={false}
      fullWidth
      slotProps={{ paper: { sx: paperSx } }}
    >
      <IconTile tone="accent" sx={iconSx}>
        <CheckRoundedIcon />
      </IconTile>

      <Typography component="p" sx={titleSx}>
        {t("dialogTitle")}
      </Typography>
      <Typography sx={descriptionSx}>{t("dialogDescription")}</Typography>

      <Stack direction="row" spacing={1.25}>
        <Button
          type="button"
          variant="outlined"
          onClick={onCloseAction}
          disabled={isSubmitting}
          sx={cancelSx}
        >
          {t("cancelLabel")}
        </Button>
        <Button
          type="button"
          variant="contained"
          color="secondary"
          onClick={onConfirmAction}
          disabled={isSubmitting}
          startIcon={
            isSubmitting ? (
              <CircularProgress size={15} color="inherit" />
            ) : (
              <CheckRoundedIcon />
            )
          }
          sx={actionSx}
        >
          {t("confirmLabel")}
        </Button>
      </Stack>
    </Dialog>
  );
};

export type { ConfirmDeliveryDialogProps } from "./types";
