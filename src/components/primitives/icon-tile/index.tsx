"use client";

import { styled } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";

import type { IconTileTone } from "../types";

const toneStyles: Record<IconTileTone, CSSObject> = {
  accent: {
    background: "var(--color-accent-tint)",
    color: "var(--color-accent)",
  },
  aqua: { background: "var(--color-aqua-light)", color: "var(--color-aqua)" },
  olive: {
    background: "var(--color-green-light)",
    color: "var(--color-olive)",
  },
};

const cycleOrder: IconTileTone[] = ["accent", "aqua", "olive"];

const resolveTone = (tone?: IconTileTone, cycle?: number): IconTileTone => {
  if (tone) {
    return tone;
  }

  if (cycle === undefined) {
    return "accent";
  }

  return cycleOrder[
    ((cycle % cycleOrder.length) + cycleOrder.length) % cycleOrder.length
  ]!;
};

export const IconTile = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone" && prop !== "cycle",
})<{ tone?: IconTileTone; cycle?: number }>(({ tone, cycle }) => ({
  display: "grid",
  placeItems: "center",
  width: 52,
  height: 52,
  borderRadius: "var(--radius-field)",
  ...toneStyles[resolveTone(tone, cycle)],
}));
