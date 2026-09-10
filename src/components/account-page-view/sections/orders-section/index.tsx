import { Chip, Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { Plate } from "@/components/primitives";
import { customerOrderStatusColors } from "@/constants/order";
import { formatOrderTracking } from "@/utils";

import { accountOrderTotalSx, SectionCard } from "../../shared";
import { ConfirmDeliveryButton } from "./confirm-delivery-button";
import type { OrdersSectionProps } from "./types";

export const OrdersSection = ({ locale, orders }: OrdersSectionProps) => {
  const t = useTranslations("accountPage");
  const tStatus = useTranslations("accountPage.orderStatuses");
  const tParcels = useTranslations("accountPage.orderParcels");

  if (orders.length === 0) {
    return (
      <SectionCard title={t("allOrders")}>
        <Typography color="text.secondary">{t("noOrders")}</Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={t("allOrders")}>
      <Stack spacing={2}>
        {orders.map((order) => (
          <Plate key={order.id} pad="sm">
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography sx={{ fontWeight: 800 }}>
                    {order.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString(locale)}
                  </Typography>
                </Stack>

                <Stack spacing={1}>
                  {order.items.map((item, i) => (
                    <Stack key={i} spacing={0.5}>
                      <Typography>
                        {item.quantity > 1
                          ? `${item.title} ×${item.quantity}`
                          : item.title}
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {item.variant ? (
                          item.variant
                            .split("/")
                            .map((part) => part.trim())
                            .filter(Boolean)
                            .map((part, j) => (
                              <Chip
                                key={j}
                                label={part}
                                size="small"
                                sx={{
                                  bgcolor: "var(--color-cream)",
                                  fontWeight: 500,
                                  height: 22,
                                  fontSize: "0.7rem",
                                }}
                              />
                            ))
                        ) : item.formatSelection ? (
                          <Chip
                            label={
                              item.formatSelection === "digital"
                                ? t("orderFormatDigital")
                                : t("orderFormatPrinted")
                            }
                            size="small"
                            sx={{
                              bgcolor: "var(--color-cream)",
                              fontWeight: 500,
                              height: 22,
                              fontSize: "0.7rem",
                            }}
                          />
                        ) : null}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Stack
                alignItems={{ xs: "flex-start", md: "flex-end" }}
                spacing={1.25}
                flexShrink={0}
              >
                <Chip
                  label={tStatus(order.status)}
                  sx={{
                    bgcolor: customerOrderStatusColors[order.status],
                    fontWeight: 700,
                  }}
                />
                <Typography sx={accountOrderTotalSx}>{order.total}</Typography>
                {order.canConfirmDelivery && (
                  <ConfirmDeliveryButton orderId={order.id} />
                )}
                {order.trackings.length > 0 && (
                  <Stack
                    alignItems={{ xs: "flex-start", md: "flex-end" }}
                    spacing={0.75}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {t("orderTrackingLabel")}
                    </Typography>
                    {order.trackings.map((tracking) => (
                      <Stack
                        key={tracking.number}
                        alignItems={{ xs: "flex-start", md: "flex-end" }}
                      >
                        {order.trackings.length > 1 && tracking.source && (
                          <Typography variant="caption" color="text.secondary">
                            {tParcels(tracking.source)}
                          </Typography>
                        )}
                        {tracking.url ? (
                          <Link
                            href={tracking.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            sx={{ fontWeight: 700 }}
                          >
                            {formatOrderTracking(tracking)}
                          </Link>
                        ) : (
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {formatOrderTracking(tracking)}
                          </Typography>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Plate>
        ))}
      </Stack>
    </SectionCard>
  );
};

export type { OrdersSectionProps } from "./types";
