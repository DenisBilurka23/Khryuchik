"use client";

import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { useOrderDeliveryConfirmation } from "@/hooks/useOrderDeliveryConfirmation";

import { OrderActionButton } from "../order-action-button";
import { ConfirmDeliveryDialog } from "./confirm-dialog";
import type { ConfirmDeliveryButtonProps } from "./types";

export const ConfirmDeliveryButton = ({
  orderId,
}: ConfirmDeliveryButtonProps) => {
  const t = useTranslations("accountPage.confirmDelivery");
  const {
    isOpen,
    isSubmitting,
    hasError,
    openDialog,
    closeDialog,
    confirmDelivery,
  } = useOrderDeliveryConfirmation({ orderId });

  return (
    <>
      <OrderActionButton
        label={t("button")}
        icon={<CheckCircleOutlineRoundedIcon />}
        onClickAction={openDialog}
      />

      <ConfirmDeliveryDialog
        isOpen={isOpen}
        isSubmitting={isSubmitting}
        onConfirmAction={() => void confirmDelivery()}
        onCloseAction={closeDialog}
      />

      {hasError && (
        <Typography variant="caption" color="error">
          {t("error")}
        </Typography>
      )}
    </>
  );
};

export type { ConfirmDeliveryButtonProps } from "./types";
