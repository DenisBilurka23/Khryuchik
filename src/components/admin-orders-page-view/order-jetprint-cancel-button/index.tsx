"use client";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { cancelAdminOrderJetprintAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";

import type { AdminOrderJetprintCancelButtonProps } from "./types";

export const AdminOrderJetprintCancelButton = ({
  orderId,
  cancelError,
}: AdminOrderJetprintCancelButtonProps) => {
  const t = useTranslations("adminPage.orders");
  const tCancel = useTranslations("adminPage.orders.cancelJetprint");
  const router = useRouter();

  const label = tCancel("button");

  const handleConfirm = async () => {
    await cancelAdminOrderJetprintAction(orderId);
    router.refresh();
  };

  return (
    <ModalButton
      label={label}
      onConfirmAction={handleConfirm}
      dialogTitle={tCancel("dialogTitle")}
      dialogDescription={tCancel("dialogDescription")}
      confirmLabel={tCancel("confirmLabel")}
      cancelLabel={tCancel("cancelLabel")}
      tooltip={
        cancelError ? t("jetprintCancelFailed", { reason: cancelError }) : label
      }
      ariaLabel={label}
      icon={<CancelOutlinedIcon key="cancel-jetprint-order-icon" />}
      iconOnly
      size="small"
      color="warning"
    />
  );
};

export type { AdminOrderJetprintCancelButtonProps } from "./types";
