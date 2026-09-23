import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { SectionCard } from "../../shared";
import { OrderCard } from "./order-card";
import type { OrdersSectionProps } from "./types";

export const OrdersSection = ({
  locale,
  orders,
  timeZone,
  orderProducts,
  productReviews,
}: OrdersSectionProps) => {
  const t = useTranslations("accountPage");

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
          <OrderCard
            key={order.id}
            order={order}
            locale={locale}
            timeZone={timeZone}
            orderProducts={orderProducts}
            productReviews={productReviews}
          />
        ))}
      </Stack>
    </SectionCard>
  );
};

export { OrderCard } from "./order-card";
export type { OrderCardProps } from "./order-card";
export type { OrdersSectionProps } from "./types";
