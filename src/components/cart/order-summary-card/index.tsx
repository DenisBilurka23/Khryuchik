import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Note, Plate } from "@/components/primitives";
import type { CartPageLabels } from "@/i18n/types";
import { displayFont } from "@/theme/sx";
import { formatCurrency } from "@/utils";

import type { OrderSummaryCardProps } from "../types";

const rowSx = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: 2,
} as const;

const rowLabelSx = {
  fontSize: 15,
  color: "var(--color-text-secondary)",
} as const;

const rowValueSx = {
  fontSize: 15,
  fontWeight: 500,
  color: "var(--color-text)",
} as const;

const noteIconSx = {
  flexShrink: 0,
  mt: "2px",
  fontSize: 18,
  color: "var(--color-action)",
} as const;

export const OrderSummaryCard = ({
  locale,
  currency,
  subtotal,
  discount,
  isDigitalOnly,
  continueShoppingHref,
  checkoutHref,
  isShopClosed = false,
  hasUnavailableItems = false,
}: OrderSummaryCardProps) => {
  const t = useTranslations("storefront.cartPage");
  const labels = t.raw("summary") as CartPageLabels["summary"];
  const total = subtotal - discount;
  const isCheckoutBlocked = isShopClosed || hasUnavailableItems;

  return (
    <Plate>
      <Typography variant="h3" sx={{ fontSize: 24, lineHeight: 1.2 }}>
        {labels.title}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.25,
          mt: 2.75,
        }}
      >
        <TextField fullWidth placeholder={labels.promoPlaceholder} />
        <Button variant="outlined" sx={{ whiteSpace: "nowrap" }}>
          {labels.promoButton}
        </Button>
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 2.75 }}
      >
        <Box sx={rowSx}>
          <Typography component="span" sx={rowLabelSx}>
            {labels.itemsLabel}
          </Typography>
          <Typography component="span" sx={rowValueSx}>
            {formatCurrency(subtotal, locale, currency)}
          </Typography>
        </Box>

        {isDigitalOnly ? null : (
          <Box sx={rowSx}>
            <Typography component="span" sx={rowLabelSx}>
              {labels.shippingLabel}
            </Typography>
            <Typography component="span" sx={rowLabelSx}>
              {labels.shippingAtCheckout}
            </Typography>
          </Box>
        )}

        {discount > 0 ? (
          <Box sx={rowSx}>
            <Typography component="span" sx={rowLabelSx}>
              {labels.discountLabel}
            </Typography>
            <Typography component="span" sx={rowValueSx}>
              {`-${formatCurrency(discount, locale, currency)}`}
            </Typography>
          </Box>
        ) : null}
      </Box>

      <Divider sx={{ my: 2.75, borderColor: "var(--color-border)" }} />

      <Box sx={rowSx}>
        <Typography
          component="span"
          sx={{ fontFamily: displayFont, fontSize: 20, fontWeight: 600 }}
        >
          {labels.totalLabel}
        </Typography>
        <Typography
          component="span"
          sx={{
            fontFamily: displayFont,
            fontSize: 28,
            fontWeight: 600,
            lineHeight: 1,
            color: "var(--color-accent)",
          }}
        >
          {formatCurrency(total, locale, currency)}
        </Typography>
      </Box>

      {isCheckoutBlocked ? (
        <Button
          disabled
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
        >
          {labels.checkoutButton}
        </Button>
      ) : (
        <Link href={checkoutHref}>
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
      )}

      <Link href={continueShoppingHref}>
        <Button
          component="span"
          fullWidth
          variant="outlined"
          size="large"
          sx={{ mt: 1.5, background: "var(--color-card)" }}
        >
          {labels.continueShopping}
        </Button>
      </Link>

      {isCheckoutBlocked ? (
        <Note sx={{ mt: 2.5 }}>
          {isShopClosed ? (
            <ScheduleOutlinedIcon sx={noteIconSx} />
          ) : (
            <ReportProblemOutlinedIcon sx={noteIconSx} />
          )}
          <Box component="span">
            {isShopClosed ? labels.closedNote : labels.unavailableNote}
          </Box>
        </Note>
      ) : null}

      <Note sx={{ mt: isCheckoutBlocked ? 1.5 : 2.5 }}>
        <LocalOfferOutlinedIcon sx={noteIconSx} />
        <Box component="span">{labels.infoText}</Box>
      </Note>
    </Plate>
  );
};
