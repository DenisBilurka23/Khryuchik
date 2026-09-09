"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

export const HeroPanel = styled(Box)(({ theme }) => ({
  borderRadius: "var(--radius-panel)",
  background: "var(--color-hero-rose)",
  [theme.breakpoints.up("md")]: {
    borderRadius: "var(--radius-hero)",
  },
}));
