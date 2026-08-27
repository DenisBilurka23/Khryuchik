"use client";

import { useState } from "react";

import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { confirmAccountOrderDeliveryClient } from "@/client-api/account";
import { ModalButton } from "@/components/modal-button";

import type { ConfirmDeliveryButtonProps } from "./types";

export const ConfirmDeliveryButton = ({
  orderId,
}: ConfirmDeliveryButtonProps) => {
  const t = useTranslations("accountPage.confirmDelivery");
  const router = useRouter();
  const [error, setError] = useState(false);

  const handleConfirm = async () => {
    const response = await confirmAccountOrderDeliveryClient(orderId);

    setError(!response.ok);

    if (response.ok) {
      router.refresh();
    }
  };

  return (
    <>
      <ModalButton
        label={t("button")}
        onConfirmAction={handleConfirm}
        dialogTitle={t("dialogTitle")}
        dialogDescription={t("dialogDescription")}
        confirmLabel={t("confirmLabel")}
        cancelLabel={t("cancelLabel")}
        icon={<TaskAltOutlinedIcon key="confirm-delivery-icon" />}
        variant="outlined"
        size="small"
        color="primary"
        confirmColor="primary"
      />
      {error && (
        <Typography variant="caption" color="error">
          {t("error")}
        </Typography>
      )}
    </>
  );
};

export type { ConfirmDeliveryButtonProps } from "./types";
