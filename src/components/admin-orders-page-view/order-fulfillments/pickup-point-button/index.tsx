"use client";

import { useState } from "react";

import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { saveAdminOrderPickupPointAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";
import { usePickupPoints } from "@/hooks/usePickupPoints";
import { formatPickupPointAddress } from "@/utils";

import type { AdminOrderPickupPointButtonProps } from "./types";

export const AdminOrderPickupPointButton = ({
  orderId,
  fulfillmentId,
  address,
  pickupPoint,
}: AdminOrderPickupPointButtonProps) => {
  const t = useTranslations("adminPage.orders.pickupPoint");
  const router = useRouter();
  const [pointId, setPointId] = useState(pickupPoint?.id ?? "");
  const { points, status } = usePickupPoints({ address, isEnabled: true });

  const label = t("button");

  const handleConfirm = async () => {
    const point = points.find((candidate) => candidate.id === pointId);

    await saveAdminOrderPickupPointAction(
      orderId,
      fulfillmentId,
      point ?? null,
    );
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
      icon={<StorefrontOutlinedIcon key="pickup-point-icon" />}
      iconOnly
      size="small"
      color="primary"
      confirmColor="primary"
    >
      <Stack spacing={2} sx={{ mt: 2, minWidth: 360 }}>
        {status === "loading" ? (
          <Typography variant="body2" color="text.secondary">
            {t("loading")}
          </Typography>
        ) : null}

        {status === "empty" ? (
          <Typography variant="body2" color="error">
            {t("empty")}
          </Typography>
        ) : null}

        {status === "ok" ? (
          <TextField
            select
            label={t("selectLabel")}
            value={pointId}
            onChange={(event) => setPointId(event.target.value)}
            size="small"
            fullWidth
          >
            <MenuItem value="">{t("none")}</MenuItem>
            {points.map((point) => (
              <MenuItem key={point.id} value={point.id}>
                {point.name} — {formatPickupPointAddress(point)}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </Stack>
    </ModalButton>
  );
};

export type { AdminOrderPickupPointButtonProps } from "./types";
