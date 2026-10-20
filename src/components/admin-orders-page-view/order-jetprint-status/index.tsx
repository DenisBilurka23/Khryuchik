import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { getJetprintOrderStatusKey } from "@/utils";

import type { AdminOrderJetprintStatusProps } from "./types";

export const AdminOrderJetprintStatus = ({
  jetprintOrder,
}: AdminOrderJetprintStatusProps) => {
  const tOrders = useTranslations("adminPage.orders");

  if (!jetprintOrder) {
    return null;
  }

  return (
    <>
      {jetprintOrder.orderNo ? (
        <Typography variant="caption" color="text.secondary">
          {tOrders("jetprintStatusLabel", {
            status: tOrders(
              `jetprintStatuses.${getJetprintOrderStatusKey(jetprintOrder.status)}`,
            ),
            orderNo: jetprintOrder.orderNo,
          })}
        </Typography>
      ) : null}
      {jetprintOrder.lastError ? (
        <Typography variant="caption" color="error">
          {tOrders("jetprintFailed", { reason: jetprintOrder.lastError })}
        </Typography>
      ) : null}
      {jetprintOrder.cancelError ? (
        <Typography variant="caption" color="error">
          {tOrders("jetprintCancelFailed", {
            reason: jetprintOrder.cancelError,
          })}
        </Typography>
      ) : null}
    </>
  );
};

export type { AdminOrderJetprintStatusProps } from "./types";
