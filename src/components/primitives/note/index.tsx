"use client";

import { styled } from "@mui/material/styles";

export const Note = styled("div")({
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: "16px 18px",
  borderRadius: "var(--radius-field)",
  background: "var(--color-accent-pale)",
  fontSize: 13,
  lineHeight: 1.55,
  color: "var(--color-text-secondary)",
});
