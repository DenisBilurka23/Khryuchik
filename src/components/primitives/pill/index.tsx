"use client";

import { styled } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";

import type { PillTone } from "../types";

const toneStyles: Record<PillTone, CSSObject> = {
  cream: {
    background: "var(--color-cream)",
    color: "var(--color-text-secondary)",
  },
  card: {
    background: "var(--color-card)",
    color: "var(--color-text-secondary)",
  },
  accent: {
    background: "var(--color-accent-pale)",
    color: "var(--color-text-secondary)",
  },
};

export const Pill = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone?: PillTone }>(({ tone = "cream" }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "6px 12px",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-pill)",
  fontSize: 12,
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  ...toneStyles[tone],
}));
