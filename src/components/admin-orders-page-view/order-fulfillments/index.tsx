import { Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  formatCurrency,
  formatOrderTracking,
  formatPickupPointAddress,
} from "@/utils";

import { AdminOrderBuyLabelButton } from "./buy-label-button";
import { AdminOrderCustomsButton } from "./customs-button";
import { AdminOrderMarkDeliveredButton } from "./mark-delivered-button";
import { AdminOrderPickupPointButton } from "./pickup-point-button";
import { AdminOrderTrackingButton } from "./tracking-button";
import type { AdminOrderFulfillmentsProps } from "./types";

export const AdminOrderFulfillments = ({
  orderId,
  locale,
  currency,
  fulfillments,
  buyableIds,
  address,
}: AdminOrderFulfillmentsProps) => {
  const t = useTranslations("adminPage.orders.tracking");
  const tParcels = useTranslations("adminPage.orders.parcels");
  const tLabel = useTranslations("adminPage.orders.buyLabel");
  const tDelivered = useTranslations("adminPage.orders.markDelivered");
  const tPickup = useTranslations("adminPage.orders.pickupPoint");

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
              {fulfillment.parcel && !buyableIds.includes(fulfillment.id) ? (
                <AdminOrderCustomsButton
                  locale={locale}
                  parcel={fulfillment.parcel}
                />
              ) : null}
              {fulfillment.pickupPoint && address ? (
                <AdminOrderPickupPointButton
                  orderId={orderId}
                  fulfillmentId={fulfillment.id}
                  address={address}
                  pickupPoint={fulfillment.pickupPoint}
                />
              ) : null}
              {!fulfillment.deliveredAt && (
                <AdminOrderMarkDeliveredButton
                  orderId={orderId}
                  fulfillmentId={fulfillment.id}
                />
              )}
            </Stack>
            {fulfillment.deliveredAt ? (
              <Typography variant="caption" color="text.secondary">
                {tDelivered("deliveredLabel", {
                  date: new Date(fulfillment.deliveredAt).toLocaleDateString(
                    locale,
                  ),
                  by: tDelivered(`by.${fulfillment.deliveredBy ?? "carrier"}`),
                })}
              </Typography>
            ) : null}
            {fulfillment.pickupPoint ? (
              <Typography variant="caption" color="text.secondary">
                {tPickup("label", {
                  name: fulfillment.pickupPoint.name,
                  address: formatPickupPointAddress(fulfillment.pickupPoint),
                  id: fulfillment.pickupPoint.id,
                })}
              </Typography>
            ) : null}
            {fulfillment.labelUrl ? (
              <Link
                href={fulfillment.labelUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="caption"
              >
                {tLabel("downloadLabel")}
              </Link>
            ) : null}
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
