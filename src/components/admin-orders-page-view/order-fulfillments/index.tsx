import { Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { formatOrderTracking } from "@/utils";

import { AdminOrderTrackingButton } from "./tracking-button";
import type { AdminOrderFulfillmentsProps } from "./types";

export const AdminOrderFulfillments = ({
  orderId,
  fulfillments,
}: AdminOrderFulfillmentsProps) => {
  const t = useTranslations("adminPage.orders.tracking");
  const tParcels = useTranslations("adminPage.orders.parcels");

  if (!fulfillments || fulfillments.length === 0) {
    return null;
  }

  return (
    <Stack spacing={0.25}>
      {fulfillments.map((fulfillment) => {
        const tracking = fulfillment.trackingNumber
          ? formatOrderTracking({
              carrier: fulfillment.carrier,
              number: fulfillment.trackingNumber,
            })
          : null;

        return (
          <Stack
            key={fulfillment.id}
            direction="row"
            spacing={0.5}
            alignItems="center"
          >
            <Typography variant="caption" color="text.secondary">
              {tParcels(fulfillment.source)}:
            </Typography>
            {tracking ? (
              fulfillment.trackingUrl ? (
                <Link
                  href={fulfillment.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="caption"
                >
                  {tracking}
                </Link>
              ) : (
                <Typography variant="caption">{tracking}</Typography>
              )
            ) : (
              <Typography variant="caption" color="text.secondary">
                {t("none")}
              </Typography>
            )}
            {/* Printify reports its own tracking through the webhook. */}
            {fulfillment.source === "manual" && (
              <AdminOrderTrackingButton
                orderId={orderId}
                fulfillment={fulfillment}
              />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export type { AdminOrderFulfillmentsProps } from "./types";
