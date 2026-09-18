import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { getTranslations } from "next-intl/server";

import {
  AdminEmptyState,
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import type { AdminPageDictionary } from "@/i18n/types";
import { formatTime } from "@/utils";
import {
  formatAdminDate,
  getAdminOrderPaymentTone,
  getAdminOrderStatusTone,
} from "@/utils/admin";

import type { AdminRecentOrdersSectionProps } from "../types";

type OrderStatusLabels = AdminPageDictionary["orders"]["statusLabels"];
type OrderPaymentStatusLabels =
  AdminPageDictionary["orders"]["paymentStatusLabels"];

export const AdminRecentOrdersSection = async ({
  orders,
  locale,
  timeZone,
}: AdminRecentOrdersSectionProps) => {
  const [tDashboard, tShared, tOrders] = await Promise.all([
    getTranslations({ locale, namespace: "adminPage.dashboard" }),
    getTranslations({ locale, namespace: "adminPage.shared" }),
    getTranslations({ locale, namespace: "adminPage.orders" }),
  ]);
  const statusLabels = tOrders.raw("statusLabels") as OrderStatusLabels;
  const paymentStatusLabels = tOrders.raw(
    "paymentStatusLabels",
  ) as OrderPaymentStatusLabels;

  return (
    <AdminSectionCard
      title={tDashboard("orders.title")}
      description={tDashboard("orders.description")}
      action={
        <Button href="/admin/orders" variant="text">
          {tDashboard("orders.action")}
        </Button>
      }
    >
      {orders.length === 0 ? (
        <AdminEmptyState
          title={tDashboard("orders.emptyTitle")}
          description={tDashboard("orders.emptyDescription")}
        />
      ) : (
        <Stack gap={2}>
          {orders.map((order) => (
            <Paper
              key={order.id}
              elevation={0}
              sx={{
                p: 2.25,
                borderRadius: "22px",
                border: "1px solid #F0DFC8",
                bgcolor: "#fff",
              }}
            >
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                gap={2}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {order.number}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {order.customerName || tShared("placeholders.noName")}
                    {order.customerContact ? ` • ${order.customerContact}` : ""}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.25 }}
                  >
                    {formatAdminDate(order.createdAt, locale, timeZone)}
                    {" · "}
                    {formatTime(order.createdAt, locale, timeZone)}
                  </Typography>
                </Box>
                <Stack
                  gap={1}
                  alignItems={{ xs: "flex-start", sm: "flex-end" }}
                >
                  <Typography sx={{ fontWeight: 700 }}>
                    {order.totalLabel}
                  </Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    <AdminStatusChip
                      label={statusLabels[order.status]}
                      tone={getAdminOrderStatusTone(order.status)}
                    />
                    <AdminStatusChip
                      label={paymentStatusLabels[order.paymentStatus]}
                      tone={getAdminOrderPaymentTone(order.paymentStatus)}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}
    </AdminSectionCard>
  );
};
