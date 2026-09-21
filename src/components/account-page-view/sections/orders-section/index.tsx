import { Chip, Link, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { Plate } from "@/components/primitives";
import { customerOrderStatusColors } from "@/constants/order";
import { formatDate, formatOrderTracking } from "@/utils";
import { accountOrderTotalSx, SectionCard } from "../../shared";
import { ConfirmDeliveryButton } from "./confirm-delivery-button";
import { OrderItemReview } from "./item-review";
import { OrderItemThumbnail } from "./item-thumbnail";
import { getOrderItemDetails, getOrderItemThumbnail } from "./utils";
import type { OrdersSectionProps } from "./types";

const itemChipSx = {
  bgcolor: "var(--color-cream)",
  fontWeight: 500,
  height: 22,
  fontSize: "0.7rem",
} as const;

export const OrdersSection = ({
  locale,
  orders,
  timeZone,
  orderProducts,
  productReviews,
}: OrdersSectionProps) => {
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

  const formatLabels = {
    digital: t("orderFormatDigital"),
    printed: t("orderFormatPrinted"),
  };

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
                    {formatDate(order.createdAt, locale, timeZone)}
                  </Typography>
                </Stack>

                <Stack spacing={1.5}>
                  {order.items.map((item, i) => {
                    const details = getOrderItemDetails(item, formatLabels);
                    const product = orderProducts[item.productId];
                    const thumbnail = getOrderItemThumbnail(item, product);

                    return (
                      <Stack
                        key={i}
                        direction="row"
                        spacing={1.5}
                        alignItems="flex-start"
                      >
                        <OrderItemThumbnail {...thumbnail} size="md" />
                        <Stack spacing={1} alignItems="flex-start">
                          <Typography>
                            {item.quantity > 1
                              ? `${item.title} ×${item.quantity}`
                              : item.title}
                          </Typography>
                          {details.length > 0 && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              flexWrap="wrap"
                            >
                              {details.map((detail, j) => (
                                <Chip
                                  key={j}
                                  label={detail}
                                  size="small"
                                  sx={itemChipSx}
                                />
                              ))}
                            </Stack>
                          )}
                          {order.canReview && (
                            <OrderItemReview
                              productId={item.productId}
                              productSlug={item.slug}
                              productTitle={item.title}
                              productType={product?.type ?? null}
                              thumbnail={thumbnail}
                              orderNumber={order.number}
                              details={details}
                              review={productReviews[item.productId] ?? null}
                            />
                          )}
                        </Stack>
                      </Stack>
                    );
                  })}
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
