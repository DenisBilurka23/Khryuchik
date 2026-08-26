"use client";

import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { buyAdminOrderLabelAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";

import type { AdminOrderBuyLabelButtonProps } from "./types";

export const AdminOrderBuyLabelButton = ({
  orderId,
  fulfillmentId,
  price,
}: AdminOrderBuyLabelButtonProps) => {
  const t = useTranslations("adminPage.orders.buyLabel");
  const router = useRouter();

  const label = t("button");

  const handleConfirm = async () => {
    await buyAdminOrderLabelAction(orderId, fulfillmentId);
    router.refresh();
  };

  return (
    <ModalButton
      label={label}
      onConfirmAction={handleConfirm}
      dialogTitle={t("dialogTitle")}
      dialogDescription={t("dialogDescription", { price })}
      confirmLabel={t("confirmLabel")}
      cancelLabel={t("cancelLabel")}
      tooltip={label}
      ariaLabel={label}
      icon={<ReceiptLongOutlinedIcon key="buy-label-icon" />}
      iconOnly
      size="small"
      color="primary"
      confirmColor="primary"
    />
  );
};

export type { AdminOrderBuyLabelButtonProps } from "./types";
