"use client";

import PrecisionManufacturingOutlinedIcon from "@mui/icons-material/PrecisionManufacturingOutlined";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { submitAdminOrderToJetprintAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";

import type { AdminOrderJetprintSubmitButtonProps } from "./types";

export const AdminOrderJetprintSubmitButton = ({
  orderId,
  lastError,
}: AdminOrderJetprintSubmitButtonProps) => {
  const t = useTranslations("adminPage.orders");
  const tSubmit = useTranslations("adminPage.orders.submitJetprint");
  const router = useRouter();

  const label = tSubmit("button");

  const handleConfirm = async () => {
    await submitAdminOrderToJetprintAction(orderId);
    router.refresh();
  };

  return (
    <ModalButton
      label={label}
      onConfirmAction={handleConfirm}
      dialogTitle={tSubmit("dialogTitle")}
      dialogDescription={tSubmit("dialogDescription")}
      confirmLabel={tSubmit("confirmLabel")}
      cancelLabel={tSubmit("cancelLabel")}
      tooltip={lastError ? t("jetprintFailed", { reason: lastError }) : label}
      ariaLabel={label}
      icon={
        <PrecisionManufacturingOutlinedIcon key="submit-jetprint-order-icon" />
      }
      iconOnly
      size="small"
      color="primary"
    />
  );
};

export type { AdminOrderJetprintSubmitButtonProps } from "./types";
