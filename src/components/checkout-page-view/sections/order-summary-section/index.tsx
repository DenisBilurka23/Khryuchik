import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { formatCurrency } from "@/utils";

import type { OrderSummarySectionProps } from "./types";

export const CheckoutOrderSummarySection = ({
  items,
  subtotal,
  shipping,
  shippingStatus,
  isDigitalOnly,
  total,
  currency,
  locale,
  error,
  isSubmitting,
  isBlocked,
  hasStoredItems,
  paymentMethod,
  labels,
}: OrderSummarySectionProps) => (
  <Card
    sx={{
      border: "1px solid #F0DFC8",
      position: { md: "sticky" },
      top: { md: 100 },
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Typography sx={{ fontSize: 24, fontWeight: 800, mb: 2 }}>
        {labels.summaryTitle}
      </Typography>

      <Stack spacing={1.5} sx={{ mb: 2 }}>
        {items.map((item) => (
          <Stack
            key={item.id}
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            gap={2}
          >
            <Stack spacing={0.5}>
              <Typography color="text.secondary">
                {item.title}
                {item.quantity > 1 ? ` ×${item.quantity}` : ""}
              </Typography>
              {item.variant ? (
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {item.variant
                    .split("/")
                    .map((part) => part.trim())
                    .filter(Boolean)
                    .map((part, index) => (
                      <Chip
                        key={index}
                        label={part}
                        size="small"
                        sx={{
                          bgcolor: "#F5F0EB",
                          fontWeight: 500,
                          height: 22,
                          fontSize: "0.7rem",
                        }}
                      />
                    ))}
                </Stack>
              ) : null}
            </Stack>
            <Typography>
              {formatCurrency(item.price * item.quantity, locale, currency)}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography color="text.secondary">
            {labels.summary.itemsLabel}
          </Typography>
          <Typography>{formatCurrency(subtotal, locale, currency)}</Typography>
        </Stack>

        {isDigitalOnly ? null : (
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">
              {labels.summary.shippingLabel}
            </Typography>
            <Typography
              color={shippingStatus === "ok" ? undefined : "text.secondary"}
            >
              {shippingStatus === "ok"
                ? shipping === 0
                  ? labels.summary.freeShipping
                  : formatCurrency(shipping, locale, currency)
                : shippingStatus === "loading"
                  ? labels.summary.shippingCalculating
                  : shippingStatus === "idle"
                    ? labels.summary.shippingPending
                    : "—"}
            </Typography>
          </Stack>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
          {labels.summary.totalLabel}
        </Typography>
        <Typography
          sx={{ fontSize: 28, fontWeight: 800, color: "primary.main" }}
        >
          {formatCurrency(total, locale, currency)}
        </Typography>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      ) : null}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        disabled={isSubmitting || isBlocked || !hasStoredItems}
        sx={{ mt: 3 }}
      >
        {isSubmitting ? labels.submit.loading : labels.submit[paymentMethod]}
      </Button>
    </CardContent>
  </Card>
);

export type { OrderSummarySectionProps } from "./types";
