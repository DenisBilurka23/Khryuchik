"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { PanelTone } from "../types";

const toneBackground: Record<PanelTone, string> = {
  cream: "var(--color-cream)",
  rose: "var(--color-hero-rose)",
  blush: "var(--color-newsletter)",
  sand: "var(--color-products)",
  card: "var(--color-card)",
  mauve: "var(--color-entertainment)",
};

export const Panel = styled(Box, {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone?: PanelTone }>(({ theme, tone = "cream" }) => ({
  padding: "24px 20px",
  borderRadius: "var(--radius-panel)",
  background: toneBackground[tone],
  [theme.breakpoints.up("md")]: {
    padding: 40,
  },
}));
