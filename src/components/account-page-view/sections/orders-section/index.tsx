import { Chip, Paper, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { customerOrderStatusColors } from "@/constants/order";

import { SectionCard } from "../../shared";

import type { OrdersSectionProps } from "./types";

export const OrdersSection = ({ locale, orders }: OrdersSectionProps) => {
  const t = useTranslations("accountPage");
  const tStatus = useTranslations("accountPage.orderStatuses");

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
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="baseline">
                  <Typography sx={{ fontWeight: 800 }}>{order.number}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(order.createdAt).toLocaleDateString(locale)}
                  </Typography>
                </Stack>

                <Stack spacing={1}>
                  {order.items.map((item, i) => (
                    <Stack key={i} spacing={0.5}>
                      <Typography>
                        {item.quantity > 1 ? `${item.title} ×${item.quantity}` : item.title}
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {item.variant
                          ? item.variant.split("/").map((part) => part.trim()).filter(Boolean).map((part, j) => (
                              <Chip
                                key={j}
                                label={part}
                                size="small"
                                sx={{ bgcolor: "#F5F0EB", fontWeight: 500, height: 22, fontSize: "0.7rem" }}
                              />
                            ))
                          : item.formatSelection ? (
                              <Chip
                                label={item.formatSelection === "digital" ? t("orderFormatDigital") : t("orderFormatPrinted")}
                                size="small"
                                sx={{ bgcolor: "#F5F0EB", fontWeight: 500, height: 22, fontSize: "0.7rem" }}
                              />
                            ) : null}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>

              <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={1.25} flexShrink={0}>
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
