"use client";

import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { CSSObject } from "@mui/material/styles";

import type { ReviewButtonProps, ReviewButtonTone } from "./types";

const toneStyles: Record<ReviewButtonTone, CSSObject> = {
  accent: {
    borderColor: "var(--color-accent-soft)",
    color: "var(--color-action)",
    "&:hover": {
      borderColor: "var(--color-accent-soft)",
      background: "var(--color-accent-pale)",
      transform: "translateY(-1px)",
    },
  },
  done: {
    borderColor: "var(--color-green-light)",
    color: "var(--color-olive)",
    "&.Mui-disabled": {
      borderColor: "var(--color-green-light)",
      color: "var(--color-olive)",
    },
  },
};

const ToneButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "tone",
})<{ tone: ReviewButtonTone }>(({ tone }) => ({
  alignSelf: "flex-start",
  minHeight: 0,
  gap: 6,
  padding: "5px 14px 5px 11px",
  border: "1.5px solid",
  borderRadius: "var(--radius-pill)",
  background: "var(--color-white)",
  fontSize: 13,
  fontWeight: 600,
  transition:
    "background 0.16s ease, border-color 0.16s ease, transform 0.16s ease",
  "& .MuiButton-startIcon": { marginLeft: 0, marginRight: 0 },
  "& .MuiButton-startIcon svg": { fontSize: 16 },
  ...toneStyles[tone],
}));

export const ReviewButton = ({ tone, label, onClick }: ReviewButtonProps) => (
  <ToneButton
    type="button"
    tone={tone}
    disabled={tone === "done"}
    onClick={onClick}
    startIcon={
      tone === "done" ? <StarRoundedIcon /> : <StarBorderRoundedIcon />
    }
  >
    {label}
  </ToneButton>
);

export type { ReviewButtonProps, ReviewButtonTone } from "./types";
