import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Box, Divider, Stack, Typography } from "@mui/material";
import type { ByReceiptCardProps } from "./types";

const serif = "var(--font-display, var(--font-display-fallback)), serif";

export const ByReceiptCard = ({
  type,
  num,
  rows,
  totalLabel,
  totalValue,
  stamp,
  accent,
}: ByReceiptCardProps) => {
  return (
    <Box
      sx={{ position: "relative", width: "100%", maxWidth: 360, ml: "auto" }}
    >
      <Box
        sx={{
          backgroundColor: "#fffaf2",
          p: 3.5,
          borderRadius: 3,
          border: `1px dashed ${accent}66`,
          boxShadow: "0 16px 40px rgba(42,37,34,0.07)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{
            pb: 1.75,
            mb: 2,
            borderBottom: "1px dashed rgba(42,37,34,0.2)",
          }}
        >
          <Typography
            sx={{
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: accent,
            }}
          >
            {type}
          </Typography>
          <Typography
            sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}
          >
            {num}
          </Typography>
        </Stack>

        {rows.map((row) => (
          <Stack
            key={row.label}
            direction="row"
            justifyContent="space-between"
            sx={{ py: 0.75, fontSize: 14, color: "text.secondary" }}
          >
            <Typography component="span" sx={{ fontSize: 14 }}>
              {row.label}
            </Typography>
            <Typography
              component="span"
              sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}
            >
              {row.value}
            </Typography>
          </Stack>
        ))}

        <Divider sx={{ my: 1, borderColor: "rgba(42,37,34,0.15)" }} />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
          sx={{ fontFamily: serif, fontSize: 22 }}
        >
          <Typography component="span" sx={{ fontFamily: serif, fontSize: 22 }}>
            {totalLabel}
          </Typography>
          <Typography
            component="span"
            sx={{
              fontFamily: serif,
              fontSize: 22,
              fontWeight: 600,
              color: accent,
            }}
          >
            {totalValue}
          </Typography>
        </Stack>
      </Box>

      <Stack
        direction="row"
        alignItems="center"
        spacing={1.25}
        sx={{
          position: "absolute",
          bottom: -28,
          right: 16,
          backgroundColor: "#fff",
          px: 1.5,
          py: 1.25,
          borderRadius: 2,
          boxShadow: "0 16px 40px rgba(42,37,34,0.07)",
          transform: "rotate(-4deg)",
        }}
      >
        <CheckCircleOutlineIcon sx={{ color: accent }} />
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: 1.2,
            color: accent,
          }}
        >
          {stamp.line1}
          <br />
          {stamp.line2}
        </Typography>
      </Stack>
    </Box>
  );
};

export type { ByReceiptCardProps } from "./types";
