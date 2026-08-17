"use client";

import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { sendAdminOrderToProductionAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";

import type { AdminOrderProductionButtonProps } from "./types";

export const AdminOrderProductionButton = ({
  orderId,
  lastError,
}: AdminOrderProductionButtonProps) => {
  const t = useTranslations("adminPage.orders");
  const tProduction = useTranslations(
    "adminPage.orders.sendToProductionConfirm",
  );
  const router = useRouter();

  const label = t("sendToProduction");

  const handleConfirm = async () => {
    await sendAdminOrderToProductionAction(orderId);
    router.refresh();
  };

  return (
    <ModalButton
      label={label}
      onConfirmAction={handleConfirm}
      dialogTitle={tProduction("dialogTitle")}
      dialogDescription={tProduction("dialogDescription")}
      confirmLabel={tProduction("confirmLabel")}
      cancelLabel={tProduction("cancelLabel")}
      tooltip={lastError ? t("printifyFailed", { reason: lastError }) : label}
      ariaLabel={label}
      icon={<FactoryOutlinedIcon key="send-order-to-production-icon" />}
      iconOnly
      size="small"
      color="primary"
    />
  );
};

export type { AdminOrderProductionButtonProps } from "./types";
