import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { StripePayCardProps } from "./types";

const serif = "var(--font-display, var(--font-display-fallback)), serif";
const STRIPE = "#635BFF";

const fieldLabelSx = {
  display: "block",
  fontSize: 11,
  color: "text.secondary",
  fontWeight: 600,
  mb: 0.75,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const cardLineSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  px: 1.75,
  py: 1.25,
  backgroundColor: "#f7f7fa",
  border: "1px solid rgba(42,37,34,0.08)",
  borderRadius: 2,
  fontSize: 14,
  fontWeight: 500,
  fontVariantNumeric: "tabular-nums",
};

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
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        ml: "auto",
        backgroundColor: "#fff",
        p: 3,
        borderRadius: 3,
        border: "1px solid rgba(42,37,34,0.08)",
        boxShadow: "0 16px 40px rgba(42,37,34,0.07)",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2.25 }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 18,
            color: STRIPE,
            letterSpacing: "-0.02em",
          }}
        >
          stripe
        </Typography>
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{ color: "text.secondary" }}
        >
          <LockOutlinedIcon sx={{ fontSize: 12 }} />
          <Typography sx={{ fontSize: 11, fontWeight: 600 }}>
            {secureLabel}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="baseline"
        sx={{
          py: 1.75,
          mb: 2.25,
          borderTop: "1px solid rgba(42,37,34,0.08)",
          borderBottom: "1px solid rgba(42,37,34,0.08)",
        }}
      >
        <Typography
          sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600 }}
        >
          {totalLabel}
        </Typography>
        <Typography sx={{ fontFamily: serif, fontSize: 32, fontWeight: 600 }}>
          {totalValue}
        </Typography>
      </Stack>

      <Box sx={{ mb: 1.5 }}>
        <Typography component="label" sx={fieldLabelSx}>
          {cardLabel}
        </Typography>
        <Box sx={cardLineSx}>
          <Box component="span">{cardMask}</Box>
          <Box
            component="span"
            sx={{
              fontSize: 10,
              fontWeight: 800,
              color: "#1a1f71",
              backgroundColor: "#fff",
              px: 0.75,
              py: 0.375,
              borderRadius: 0.75,
              border: "1px solid rgba(42,37,34,0.08)",
              letterSpacing: "0.05em",
            }}
          >
            {cardBrand}
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
          mb: 2.25,
        }}
      >
        <Box>
          <Typography component="label" sx={fieldLabelSx}>
            {expLabel}
          </Typography>
          <Box sx={cardLineSx}>{exp}</Box>
        </Box>
        <Box>
          <Typography component="label" sx={fieldLabelSx}>
            {cvcLabel}
          </Typography>
          <Box sx={cardLineSx}>{cvc}</Box>
        </Box>
      </Box>

      <Button
        fullWidth
        endIcon={<ArrowForwardIcon />}
        sx={{
          backgroundColor: STRIPE,
          color: "#fff",
          borderRadius: 2.5,
          py: 1.5,
          fontWeight: 700,
          "&:hover": { backgroundColor: "#4e47d6" },
        }}
      >
        {payLabel}
      </Button>
    </Box>
  );
};

export type { StripePayCardProps } from "./types";
