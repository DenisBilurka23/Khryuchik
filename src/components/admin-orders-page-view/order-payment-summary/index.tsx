import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { formatCurrency } from "@/utils";

import type { AdminOrderPaymentSummaryProps } from "./types";

export const AdminOrderPaymentSummary = ({
  payment,
  locale,
  currency,
}: AdminOrderPaymentSummaryProps) => {
  const tOrders = useTranslations("adminPage.orders");
  const methodLabels = tOrders.raw("paymentMethodLabels") as Record<
    string,
    string
  >;
  const statusLabels = tOrders.raw("paymentStatusLabels") as Record<
    string,
    string
  >;

  return (
    <Stack>
      <Typography variant="body2">
        {methodLabels[payment.method] ?? payment.method}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {statusLabels[payment.status] ?? payment.status}
      </Typography>
      {payment.refundedAmount !== undefined && (
        <Typography variant="caption" color="text.secondary">
          {tOrders("refundedAmountLabel", {
            amount: formatCurrency(payment.refundedAmount, locale, currency),
          })}
        </Typography>
      )}
    </Stack>
  );
};

export type { AdminOrderPaymentSummaryProps } from "./types";
