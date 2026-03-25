"use client";

import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import { Box, Button, Card, CardContent, Divider, Stack, TextField, Typography } from "@mui/material";

import type { OrderSummaryCardProps } from "./types";
import { formatCurrency } from "../utils";

export const OrderSummaryCard = ({
  locale,
  labels,
  subtotal,
  shipping,
  discount,
  continueShoppingHref,
}: OrderSummaryCardProps) => {
  const total = subtotal + shipping - discount;

  return (
    <Card
      sx={{
        border: "1px solid #F0DFC8",
        position: { md: "sticky" },
        top: { md: 100 },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 800 }}>
          {labels.title}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <TextField fullWidth placeholder={labels.promoPlaceholder} />
          <Button
            variant="outlined"
            color="inherit"
            sx={{ borderColor: "#E8D6BF", whiteSpace: "nowrap" }}
          >
            {labels.promoButton}
          </Button>
        </Stack>

        <Stack spacing={2} sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">{labels.itemsLabel}</Typography>
            <Typography>{formatCurrency(subtotal, locale)}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">{labels.shippingLabel}</Typography>
            <Typography>
              {shipping === 0 ? labels.freeShipping : formatCurrency(shipping, locale)}
            </Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between">
            <Typography color="text.secondary">{labels.discountLabel}</Typography>
            <Typography>
              {discount > 0 ? `-${formatCurrency(discount, locale)}` : formatCurrency(0, locale)}
            </Typography>
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
            {labels.totalLabel}
          </Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 800, color: "primary.main" }}>
            {formatCurrency(total, locale)}
          </Typography>
        </Stack>

        <Button fullWidth variant="contained" size="large" sx={{ mt: 3 }}>
          {labels.checkoutButton}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="inherit"
          size="large"
          sx={{ mt: 2, borderColor: "#E8D6BF", bgcolor: "#fff" }}
          href={continueShoppingHref}
        >
          {labels.continueShopping}
        </Button>

        <Box
          sx={{
            mt: 3,
            p: 2,
            borderRadius: "20px",
            bgcolor: "#FFF8F0",
            border: "1px solid #F0DFC8",
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <LocalOfferOutlinedIcon fontSize="small" sx={{ mt: "2px" }} />
            <Box>
              <Typography sx={{ fontWeight: 700 }}>{labels.infoTitle}</Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, lineHeight: 1.7 }}
              >
                {labels.infoText}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};