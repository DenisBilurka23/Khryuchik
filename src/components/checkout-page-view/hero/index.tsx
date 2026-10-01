import { Box, Typography } from "@mui/material";

import type { CheckoutHeroProps } from "./types";

const heroSx = {
  borderRadius: "32px",
  p: { xs: 3, md: 5 },
  background:
    "radial-gradient(circle at top left, var(--color-wash-rose), transparent 30%), radial-gradient(circle at right, var(--color-wash-butter), transparent 28%), var(--color-cream)",
  border: "1px solid var(--color-border)",
  mb: 5,
} as const;

const eyebrowSx = {
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  fontSize: 13,
  fontWeight: 700,
  color: "primary.main",
} as const;

const titleSx = { mt: 2, fontSize: { xs: 36, md: 56 } } as const;

const leadSx = {
  mt: 2,
  maxWidth: 760,
  lineHeight: 1.8,
  fontSize: { xs: 16, md: 18 },
} as const;

export const CheckoutHero = ({ eyebrow, title, lead }: CheckoutHeroProps) => (
  <Box sx={heroSx}>
    <Typography sx={eyebrowSx}>{eyebrow}</Typography>
    <Typography variant="h1" sx={titleSx}>
      {title}
    </Typography>
    <Typography color="text.secondary" sx={leadSx}>
      {lead}
    </Typography>
  </Box>
);

export type { CheckoutHeroProps } from "./types";
