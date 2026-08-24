import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdminOrderPrintifyStatusProps } from "./types";

export const AdminOrderPrintifyStatus = ({
  printifyOrder,
}: AdminOrderPrintifyStatusProps) => {
  const tOrders = useTranslations("adminPage.orders");

  if (!printifyOrder?.status) {
    return null;
  }

  return (
    <Typography variant="caption" color="text.secondary">
      {tOrders("printifyStatusLabel", { status: printifyOrder.status })}
    </Typography>
  );
};

export type { AdminOrderPrintifyStatusProps } from "./types";
