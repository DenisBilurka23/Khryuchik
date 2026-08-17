"use client";

import FactoryOutlinedIcon from "@mui/icons-material/FactoryOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { sendAdminOrderToProductionAction } from "@/app/(admin)/admin/actions";

import type { AdminOrderProductionButtonProps } from "./types";

export const AdminOrderProductionButton = ({
  orderId,
  lastError,
}: AdminOrderProductionButtonProps) => {
  const t = useTranslations("adminPage.orders");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await sendAdminOrderToProductionAction(orderId);
      if (result.ok) router.refresh();
    });
  };

  const label = lastError
    ? t("printifyFailed", { reason: lastError })
    : t("sendToProduction");

  return (
    <Tooltip title={label}>
      <span>
        <IconButton
          size="small"
          color="primary"
          disabled={isPending || Boolean(lastError)}
          onClick={handleClick}
          aria-label={label}
        >
          <FactoryOutlinedIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export type { AdminOrderProductionButtonProps } from "./types";
