import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Button, Typography } from "@mui/material";

import { displayFont } from "@/theme/sx";

import type { StripePayCardProps } from "./types";

const cardSx = {
  p: 3,
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-plate)",
  background: "var(--color-white)",
  fontVariantNumeric: "tabular-nums",
} as const;

const brandSx = {
  fontSize: 18,
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: "#635bff",
} as const;

const secureSx = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
  fontSize: 11,
  fontWeight: 600,
  color: "var(--color-text-secondary)",
} as const;

const totalRowSx = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  margin: "18px 0",
  padding: "14px 0",
  borderTop: "1px solid var(--color-border)",
  borderBottom: "1px solid var(--color-border)",
} as const;

const totalLabelSx = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--color-text-secondary)",
} as const;

const totalValueSx = {
  fontFamily: displayFont,
  fontSize: 32,
  fontWeight: 600,
  lineHeight: 1,
} as const;

const fieldLabelSx = {
  display: "block",
  mb: 0.75,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "var(--color-text-secondary)",
} as const;

const fieldValueSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minHeight: 42,
  padding: "0 14px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-field)",
  background: "var(--color-cream)",
  fontSize: 14,
  fontWeight: 500,
} as const;

const brandBadgeSx = {
  padding: "3px 6px",
  border: "1px solid var(--color-border)",
  borderRadius: "6px",
  background: "var(--color-white)",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.05em",
  color: "var(--color-text-secondary)",
} as const;

const payButtonSx = {
  minHeight: 48,
  borderRadius: "var(--radius-button)",
  fontSize: 14,
  fontWeight: 600,
} as const;

export const StripePayCard = ({
  secureLabel,
  totalLabel,
  totalValue,
  cardLabel,
  cardMask,
  cardBrand,
  expLabel,
  exp,
  cvcLabel,
  cvc,
  payLabel,
}: StripePayCardProps) => {
  return (
    <Box sx={cardSx}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography component="span" sx={brandSx}>
          stripe
        </Typography>

        <Box sx={secureSx}>
          <LockOutlinedIcon sx={{ fontSize: 12 }} />
          {secureLabel}
        </Box>
      </Box>

      <Box sx={totalRowSx}>
        <Typography component="span" sx={totalLabelSx}>
          {totalLabel}
        </Typography>
        <Typography component="span" sx={totalValueSx}>
          {totalValue}
        </Typography>
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography component="label" sx={fieldLabelSx}>
          {cardLabel}
        </Typography>
        <Box sx={fieldValueSx}>
          <Box component="span">{cardMask}</Box>
          <Box component="span" sx={brandBadgeSx}>
            {cardBrand}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 1.5,
          mt: 1.5,
          mb: 2.5,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography component="label" sx={fieldLabelSx}>
            {expLabel}
          </Typography>
          <Box sx={fieldValueSx}>{exp}</Box>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography component="label" sx={fieldLabelSx}>
            {cvcLabel}
          </Typography>
          <Box sx={fieldValueSx}>{cvc}</Box>
        </Box>
      </Box>

      <Button
        fullWidth
        variant="contained"
        endIcon={<ArrowForwardIcon />}
        sx={payButtonSx}
      >
        {payLabel}
      </Button>
    </Box>
  );
};

export type { StripePayCardProps } from "./types";
