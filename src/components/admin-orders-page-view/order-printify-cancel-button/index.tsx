"use client";

import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { cancelAdminOrderPrintifyAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";

import type { AdminOrderPrintifyCancelButtonProps } from "./types";

export const AdminOrderPrintifyCancelButton = ({
  orderId,
  cancelError,
}: AdminOrderPrintifyCancelButtonProps) => {
  const t = useTranslations("adminPage.orders");
  const tCancel = useTranslations("adminPage.orders.cancelPrintify");
  const router = useRouter();

  const label = tCancel("button");

  const handleConfirm = async () => {
    await cancelAdminOrderPrintifyAction(orderId);
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
        cancelError ? t("printifyCancelFailed", { reason: cancelError }) : label
      }
      ariaLabel={label}
      icon={<CancelOutlinedIcon key="cancel-printify-order-icon" />}
      iconOnly
      size="small"
      color="warning"
    />
  );
};

export type { AdminOrderPrintifyCancelButtonProps } from "./types";
