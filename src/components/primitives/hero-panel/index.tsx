"use client";

import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import type { HeroPanelTone } from "../types";

const toneBackground: Record<HeroPanelTone, string> = {
  rose: "var(--color-hero-rose)",
  pale: "var(--color-accent-pale)",
};

export const HeroPanel = styled(Box, {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone?: HeroPanelTone }>(({ theme, tone = "rose" }) => ({
  borderRadius: "var(--radius-panel)",
  background: toneBackground[tone],
  [theme.breakpoints.up("md")]: {
    borderRadius: "var(--radius-hero)",
  },
}));
