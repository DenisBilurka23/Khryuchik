"use client";

import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { markAdminOrderParcelDeliveredAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";

import type { AdminOrderMarkDeliveredButtonProps } from "./types";

export const AdminOrderMarkDeliveredButton = ({
  orderId,
  fulfillmentId,
}: AdminOrderMarkDeliveredButtonProps) => {
  const t = useTranslations("adminPage.orders.markDelivered");
  const router = useRouter();

  const label = t("button");

  const handleConfirm = async () => {
    await markAdminOrderParcelDeliveredAction(orderId, fulfillmentId);
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
      icon={<TaskAltOutlinedIcon key="mark-delivered-icon" />}
      iconOnly
      size="small"
      color="primary"
      confirmColor="primary"
    />
  );
};

export type { AdminOrderMarkDeliveredButtonProps } from "./types";
