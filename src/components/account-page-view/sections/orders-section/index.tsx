import { Chip, Paper, Stack, Typography } from "@mui/material";

import { SectionCard } from "../../shared";

import type { OrdersSectionProps } from "./types";

export const OrdersSection = ({ dictionary, orders }: OrdersSectionProps) => {
  return (
    <SectionCard title={dictionary.allOrders}>
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
                <Typography sx={{ fontWeight: 800 }}>{order.id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {order.date}
                </Typography>
                <Typography>{order.items}</Typography>
              </Stack>
              <Stack alignItems={{ xs: "flex-start", md: "flex-end" }} spacing={1.25}>
                <Chip
                  label={order.status}
                  sx={{
                    bgcolor: order.status === dictionary.delivered ? "#E6F6EC" : "#FFF3D6",
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