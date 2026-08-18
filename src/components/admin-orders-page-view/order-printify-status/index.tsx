import { Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { formatOrderTracking, getOrderTracking } from "@/utils";

import type { AdminOrderPrintifyStatusProps } from "./types";

export const AdminOrderPrintifyStatus = ({
  printifyOrder,
}: AdminOrderPrintifyStatusProps) => {
  const tOrders = useTranslations("adminPage.orders");
  const tracking = getOrderTracking({ printifyOrder });

  if (!printifyOrder?.status && !tracking) {
    return null;
  }

  const trackingLabel = tracking
    ? tOrders("trackingLabel", { tracking: formatOrderTracking(tracking) })
    : null;

  return (
    <Stack spacing={0.25}>
      {printifyOrder?.status && (
        <Typography variant="caption" color="text.secondary">
          {tOrders("printifyStatusLabel", { status: printifyOrder.status })}
        </Typography>
      )}
      {trackingLabel &&
        (tracking?.url ? (
          <Link
            href={tracking.url}
            target="_blank"
            rel="noopener noreferrer"
            variant="caption"
          >
            {trackingLabel}
          </Link>
        ) : (
          <Typography variant="caption" color="text.secondary">
            {trackingLabel}
          </Typography>
        ))}
    </Stack>
  );
};

export type { AdminOrderPrintifyStatusProps } from "./types";
