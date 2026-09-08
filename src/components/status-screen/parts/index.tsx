"use client";

import { styled } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";
import Link from "next/link";

import { displayFont } from "@/theme/sx";

const palette = {
  cardPink: "#f6cdd6",
  cardWarm: "#f6d6bf",
  coral: "#e8637c",
  coralDeep: "#d94f6a",
  ink: "#2b2a2e",
  muted: "#8f8b93",
  line: "rgba(42, 37, 34, 0.14)",
  danger: "#c2453f",
  butter: "#f3e2a6",
  mint: "#bfe8d4",
} as const;

export const Screen = styled("section")({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "calc(100vh - 220px)",
  overflow: "hidden",
  padding: "64px 24px",
  background: "linear-gradient(160deg, #fdf2ea 0%, #f9dde3 100%)",
  color: palette.ink,
});

const Float = styled("span")(({ theme }) => ({
  position: "absolute",
  display: "none",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  pointerEvents: "none",
  [theme.breakpoints.up("sm")]: { display: "flex" },
}));

export const FloatStar = styled(Float)({
  top: "14%",
  left: "16%",
  width: 44,
  height: 44,
  background: palette.butter,
  fontSize: 22,
  transform: "rotate(-12deg)",
});

export const FloatBook = styled(Float)({
  bottom: "18%",
  right: "18%",
  width: 36,
  height: 36,
  background: palette.mint,
  fontSize: 18,
  transform: "rotate(10deg)",
});

export const FloatSparkle = styled(Float)({
  top: "26%",
  right: "22%",
  width: 28,
  height: 28,
  background: "#fff",
  fontSize: 14,
});

export const Blob = styled("span", {
  shouldForwardProp: (prop) => prop !== "tone" && prop !== "compact",
})<{ tone: "pink" | "warm"; compact: boolean }>(({ tone, compact }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  background: tone === "warm" ? palette.cardWarm : palette.cardPink,
  ...(compact
    ? { width: 110, height: 110, margin: "-30px auto 0", fontSize: 56 }
    : { width: 130, height: 130, margin: "0 auto 6px", fontSize: 66 }),
}));

export const Code = styled("span")({
  display: "block",
  fontFamily: displayFont,
  fontSize: "clamp(96px, 22vw, 150px)",
  fontWeight: 700,
  lineHeight: 1,
  color: "#fff",
  letterSpacing: "0.02em",
  textShadow: "0 6px 0 rgba(216, 120, 140, 0.35)",
});

export const Title = styled("h1", {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone: "default" | "danger" }>(({ tone }) => ({
  margin: "14px 0 12px",
  fontFamily: displayFont,
  fontSize: "clamp(28px, 6vw, 34px)",
  fontWeight: 700,
  lineHeight: 1.15,
  ...(tone === "danger" ? { color: palette.danger } : {}),
}));

export const Text = styled("p")({
  maxWidth: 420,
  margin: "0 auto 26px",
  fontSize: 16,
  lineHeight: 1.6,
  color: palette.muted,
});

export const Footer = styled("p")({
  marginTop: 26,
  fontSize: 13,
  color: palette.muted,
  "& a": { color: palette.coralDeep, textDecoration: "none" },
  "& a:hover": { color: palette.coral },
});

const actionBase: CSSObject = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 999,
  padding: "14px 28px",
  font: "inherit",
  fontSize: 15,
  fontWeight: 600,
  textDecoration: "none",
  border: "1px solid transparent",
  cursor: "pointer",
  transition:
    "transform 0.15s ease, background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
};

const actionVariant: Record<"primary" | "ghost", CSSObject> = {
  primary: {
    background: palette.coral,
    color: "#fff",
    "&:hover": { background: palette.coralDeep, transform: "translateY(-1px)" },
  },
  ghost: {
    background: "transparent",
    color: palette.ink,
    borderColor: palette.line,
    "&:hover": { borderColor: palette.coral, color: palette.coral },
  },
};

type ActionVariant = { variant: "primary" | "ghost" };

export const ActionLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== "variant",
})<ActionVariant>(({ variant }) => ({
  ...actionBase,
  ...actionVariant[variant],
}));

export const ActionButton = styled("button", {
  shouldForwardProp: (prop) => prop !== "variant",
})<ActionVariant>(({ variant }) => ({
  ...actionBase,
  ...actionVariant[variant],
}));
