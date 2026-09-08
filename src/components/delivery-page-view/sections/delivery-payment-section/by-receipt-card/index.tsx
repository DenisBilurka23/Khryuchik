import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Typography } from "@mui/material";

import { displayFont } from "@/theme/sx";

import type { ByReceiptCardProps } from "./types";

const paperSx = {
  p: 3.5,
  border: "1px dashed var(--color-border-rose)",
  borderRadius: "var(--radius-plate)",
  background: "var(--color-cream)",
  fontVariantNumeric: "tabular-nums",
} as const;

const rowSx = {
  display: "flex",
  justifyContent: "space-between",
  gap: 2,
} as const;

const headerSx = {
  ...rowSx,
  pb: 1.75,
  mb: 2,
  borderBottom: "1px dashed var(--color-border)",
} as const;

const totalRowSx = {
  ...rowSx,
  alignItems: "baseline",
  mt: 1,
  pt: 1.75,
  borderTop: "1px dashed var(--color-border)",
} as const;

const capsSx = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  color: "var(--color-accent)",
} as const;

const numberSx = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--color-text-secondary)",
} as const;

const rowLabelSx = {
  fontSize: 14,
  color: "var(--color-text-secondary)",
} as const;

const rowValueSx = {
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-text)",
} as const;

const totalTextSx = {
  fontFamily: displayFont,
  fontSize: 22,
  lineHeight: 1.2,
} as const;

const stampSx = {
  position: "absolute",
  right: 16,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  gap: 1.25,
  padding: "10px 14px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-field)",
  background: "var(--color-card)",
  transform: "rotate(-4deg)",
} as const;

export const ByReceiptCard = ({
  type,
  num,
  rows,
  totalLabel,
  totalValue,
  stamp,
}: ByReceiptCardProps) => {
  return (
    <Box sx={{ position: "relative", width: "100%", pb: 3.5 }}>
      <Box sx={paperSx}>
        <Box sx={headerSx}>
          <Typography
            component="span"
            sx={{ ...capsSx, letterSpacing: "0.18em" }}
          >
            {type}
          </Typography>
          <Typography component="span" sx={numberSx}>
            {num}
          </Typography>
        </Box>

        {rows.map((row) => (
          <Box key={row.label} sx={{ ...rowSx, py: 0.75 }}>
            <Typography component="span" sx={rowLabelSx}>
              {row.label}
            </Typography>
            <Typography component="span" sx={rowValueSx}>
              {row.value}
            </Typography>
          </Box>
        ))}

        <Box sx={totalRowSx}>
          <Typography component="span" sx={totalTextSx}>
            {totalLabel}
          </Typography>
          <Typography
            component="span"
            sx={{
              ...totalTextSx,
              fontWeight: 600,
              color: "var(--color-accent)",
            }}
          >
            {totalValue}
          </Typography>
        </Box>
      </Box>

      <Box sx={stampSx}>
        <CheckCircleOutlineIcon
          sx={{ fontSize: 22, color: "var(--color-accent)" }}
        />
        <Typography
          component="span"
          sx={{ ...capsSx, lineHeight: 1.2, letterSpacing: "0.06em" }}
        >
          {stamp.line1}
          <br />
          {stamp.line2}
        </Typography>
      </Box>
    </Box>
  );
};

export type { ByReceiptCardProps } from "./types";
