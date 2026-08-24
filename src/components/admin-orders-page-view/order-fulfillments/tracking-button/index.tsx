"use client";

import { useState } from "react";

import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { saveAdminOrderTrackingAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";

import type { AdminOrderTrackingButtonProps } from "./types";

export const AdminOrderTrackingButton = ({
  orderId,
  fulfillment,
}: AdminOrderTrackingButtonProps) => {
  const t = useTranslations("adminPage.orders.tracking");
  const router = useRouter();
  const [carrier, setCarrier] = useState(fulfillment.carrier ?? "");
  const [trackingNumber, setTrackingNumber] = useState(
    fulfillment.trackingNumber ?? "",
  );
  const [trackingUrl, setTrackingUrl] = useState(fulfillment.trackingUrl ?? "");

  const label = t("button");

  const handleConfirm = async () => {
    await saveAdminOrderTrackingAction(orderId, fulfillment.id, {
      carrier,
      trackingNumber,
      trackingUrl,
    });
    router.refresh();
  };

  return (
    <ModalButton
      label={label}
      onConfirmAction={handleConfirm}
      dialogTitle={t("dialogTitle")}
      dialogDescription={t("dialogDescription")}
      confirmLabel={t("confirmLabel")}
      cancelLabel={t("cancelLabel")}
      tooltip={label}
      ariaLabel={label}
      icon={<LocalShippingOutlinedIcon key="order-tracking-icon" />}
      iconOnly
      size="small"
      color="primary"
      confirmColor="primary"
    >
      <Stack spacing={2} sx={{ mt: 2, minWidth: 320 }}>
        <TextField
          label={t("carrierLabel")}
          value={carrier}
          onChange={(event) => setCarrier(event.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label={t("numberLabel")}
          value={trackingNumber}
          onChange={(event) => setTrackingNumber(event.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label={t("urlLabel")}
          value={trackingUrl}
          onChange={(event) => setTrackingUrl(event.target.value)}
          size="small"
          fullWidth
        />
      </Stack>
    </ModalButton>
  );
};

export type { AdminOrderTrackingButtonProps } from "./types";
