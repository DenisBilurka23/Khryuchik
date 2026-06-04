import { Chip, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { customerOrderStatusColors } from "@/constants/order";

import { SectionCard } from "../../shared";

import type { OrdersSectionProps } from "./types";

export const OrdersSection = ({ locale, orders }: OrdersSectionProps) => {
  const t = useTranslations("accountPage");
  const tStatus = useTranslations("accountPage.orderStatuses");
  const tEmpty = useTranslations("accountPage");

  if (orders.length === 0) {
    return (
      <SectionCard title={t("allOrders")}>
        <Typography color="text.secondary">{tEmpty("noOrders")}</Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={t("allOrders")}>
      <Stack spacing={2}>
        {orders.map((order) => (
          <Paper
            key={order.id}
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: "22px",
              border: "1px solid #F0DFC8",
              bgcolor: "#fff",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack spacing={0.75}>
                <Typography sx={{ fontWeight: 800 }}>{order.number}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.createdAt).toLocaleDateString(locale)}
                </Typography>
                <Typography>{order.itemsSummary}</Typography>
              </Stack>
              <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={1.25}>
                <Chip
                  label={tStatus(order.status)}
                  sx={{
                    bgcolor: customerOrderStatusColors[order.status],
                    fontWeight: 700,
                  }}
                />
                <Typography sx={{ fontWeight: 800 }}>{order.total}</Typography>
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </SectionCard>
  );
};

export type { OrdersSectionProps } from "./types";
