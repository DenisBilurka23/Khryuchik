"use client";

import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { refundAdminOrderPaymentAction } from "@/app/(admin)/admin/actions";
import { ModalButton } from "@/components/modal-button";

import type { AdminOrderRefundButtonProps } from "./types";

export const AdminOrderRefundButton = ({
  orderId,
  amount,
}: AdminOrderRefundButtonProps) => {
  const tRefund = useTranslations("adminPage.orders.refund");
  const router = useRouter();

  const label = tRefund("button");

  const handleConfirm = async () => {
    await refundAdminOrderPaymentAction(orderId);
    router.refresh();
  };

  return (
    <ModalButton
      label={label}
      onConfirmAction={handleConfirm}
      dialogTitle={tRefund("dialogTitle")}
      dialogDescription={tRefund("dialogDescription", { amount })}
      confirmLabel={tRefund("confirmLabel")}
      cancelLabel={tRefund("cancelLabel")}
      tooltip={label}
      ariaLabel={label}
      icon={<CurrencyExchangeOutlinedIcon key="refund-order-icon" />}
      iconOnly
      size="small"
      color="warning"
    />
  );
};

export type { AdminOrderRefundButtonProps } from "./types";
