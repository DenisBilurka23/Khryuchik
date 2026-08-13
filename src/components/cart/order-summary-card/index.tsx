import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { formatCurrency } from "@/utils";
import type { CartPageLabels } from "@/i18n/types";

import type { OrderSummaryCardProps } from "../types";

export const OrderSummaryCard = ({
  locale,
  currency,
  subtotal,
  discount,
  isDigitalOnly,
  continueShoppingHref,
  checkoutHref,
}: OrderSummaryCardProps) => {
  const t = useTranslations("storefront.cartPage");
  const labels = t.raw("summary") as CartPageLabels["summary"];
  const total = subtotal - discount;

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
            <Typography>
              {formatCurrency(subtotal, locale, currency)}
            </Typography>
          </Stack>

          {isDigitalOnly ? null : (
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">
                {labels.shippingLabel}
              </Typography>
              <Typography color="text.secondary">
                {labels.shippingAtCheckout}
              </Typography>
            </Stack>
          )}

          {discount > 0 ? (
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">
                {labels.discountLabel}
              </Typography>
              <Typography>
                {`-${formatCurrency(discount, locale, currency)}`}
              </Typography>
            </Stack>
          ) : null}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
            {labels.totalLabel}
          </Typography>
          <Typography
            sx={{ fontSize: 28, fontWeight: 800, color: "primary.main" }}
          >
            {formatCurrency(total, locale, currency)}
          </Typography>
        </Stack>

        <Link
          href={checkoutHref}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button
            component="span"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3 }}
          >
            {labels.checkoutButton}
          </Button>
        </Link>

        <Link
          href={continueShoppingHref}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button
            component="span"
            fullWidth
            variant="outlined"
            color="inherit"
            size="large"
            sx={{ mt: 2, borderColor: "#E8D6BF", bgcolor: "#fff" }}
          >
            {labels.continueShopping}
          </Button>
        </Link>

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
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.7 }}
            >
              {labels.infoText}
            </Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};