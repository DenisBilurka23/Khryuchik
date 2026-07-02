"use client";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { confirmAdminOrderPaymentAction } from "@/app/(admin)/admin/actions";

import type { AdminOrderPaymentConfirmButtonProps } from "./types";

export const AdminOrderPaymentConfirmButton = ({
  orderId,
}: AdminOrderPaymentConfirmButtonProps) => {
  const t = useTranslations("adminPage.orders");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await confirmAdminOrderPaymentAction(orderId);
      if (result.ok) router.refresh();
    });
  };

  return (
    <Tooltip title={t("confirmPayment")}>
      <span>
        <IconButton
          size="small"
          color="success"
          disabled={isPending}
          onClick={handleClick}
          aria-label={t("confirmPayment")}
        >
          <CheckCircleOutlineIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export type { AdminOrderPaymentConfirmButtonProps } from "./types";
