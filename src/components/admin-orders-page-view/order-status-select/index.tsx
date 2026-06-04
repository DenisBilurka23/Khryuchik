"use client";

import { FormControl, MenuItem, Select } from "@mui/material";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";

import { updateAdminOrderStatusAction } from "@/app/(admin)/admin/actions";
import { ORDER_STATUSES, type OrderStatus } from "@/types/order";

import type { AdminOrderStatusSelectProps } from "./types";

export const AdminOrderStatusSelect = ({
  orderId,
  currentStatus,
}: AdminOrderStatusSelectProps) => {
  const tStatus = useTranslations("adminPage.orders.statusLabels");
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextStatus: OrderStatus) => {
    if (nextStatus === status) return;

    const previous = status;
    setStatus(nextStatus);

    startTransition(async () => {
      const result = await updateAdminOrderStatusAction(orderId, nextStatus);
      if (!result.ok) {
        setStatus(previous);
      }
    });
  };

  return (
    <FormControl size="small" disabled={isPending}>
      <Select
        value={status}
        onChange={(event) => handleChange(event.target.value as OrderStatus)}
        sx={{ minWidth: 140, fontSize: 14 }}
      >
        {ORDER_STATUSES.map((option) => (
          <MenuItem key={option} value={option}>
            {tStatus(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export type { AdminOrderStatusSelectProps } from "./types";
