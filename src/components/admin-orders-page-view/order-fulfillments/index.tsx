import { Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { formatCurrency, formatOrderTracking } from "@/utils";

import { AdminOrderBuyLabelButton } from "./buy-label-button";
import { AdminOrderTrackingButton } from "./tracking-button";
import type { AdminOrderFulfillmentsProps } from "./types";

export const AdminOrderFulfillments = ({
  orderId,
  locale,
  currency,
  fulfillments,
  buyableIds,
}: AdminOrderFulfillmentsProps) => {
  const t = useTranslations("adminPage.orders.tracking");
  const tParcels = useTranslations("adminPage.orders.parcels");
  const tLabel = useTranslations("adminPage.orders.buyLabel");

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
          <Stack key={fulfillment.id} spacing={0.25}>
            <Stack direction="row" spacing={0.5} alignItems="center">
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
              {fulfillment.source === "manual" && (
                <AdminOrderTrackingButton
                  orderId={orderId}
                  fulfillment={fulfillment}
                />
              )}
              {!fulfillment.trackingNumber &&
                buyableIds.includes(fulfillment.id) && (
                  <AdminOrderBuyLabelButton
                    orderId={orderId}
                    fulfillmentId={fulfillment.id}
                    price={formatCurrency(
                      fulfillment.amount,
                      locale,
                      fulfillment.currency,
                    )}
                  />
                )}
            </Stack>
            {fulfillment.labelAmount !== undefined &&
              fulfillment.labelAmount !== fulfillment.amount && (
                <Typography variant="caption" color="text.secondary">
                  {tLabel("costLabel", {
                    paid: formatCurrency(fulfillment.amount, locale, currency),
                    cost: formatCurrency(
                      fulfillment.labelAmount,
                      locale,
                      fulfillment.currency,
                    ),
                  })}
                </Typography>
              )}

            {fulfillment.lastError && (
              <Typography variant="caption" color="error">
                {fulfillment.lastError}
              </Typography>
            )}
          </Stack>
        );
      })}
    </Stack>
  );
};

export type { AdminOrderFulfillmentsProps } from "./types";
