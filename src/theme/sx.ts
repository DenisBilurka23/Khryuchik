import type { SxProps, Theme } from "@mui/material";

export const displayFont =
  "var(--font-display, var(--font-display-fallback)), serif";

export const leadSx = {
  fontSize: 16,
  lineHeight: 1.65,
  color: "var(--color-text-secondary)",
} as const satisfies SxProps<Theme>;

export const cardFrameSx = {
  height: "100%",
  display: "flex",
  flexDirection: "column",
  background: "var(--color-card)",
  border: "1px solid var(--color-border)",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    borderColor: "var(--color-border-rose)",
    boxShadow: "var(--shadow-card)",
  },
} as const satisfies SxProps<Theme>;

export const inputFieldSx = {
  "& .MuiOutlinedInput-root": {
    minHeight: 56,
    paddingInline: "16px",
    borderRadius: "var(--radius-field)",
    background: "var(--color-card)",
    fontSize: 15,
  },
  "& .MuiOutlinedInput-input": { padding: 0 },
  "& .MuiOutlinedInput-input::placeholder": {
    color: "var(--color-text-muted)",
    opacity: 1,
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--color-border)" },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--color-border-rose)",
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderWidth: 1,
    borderColor: "var(--color-action)",
  },
  "& .MuiOutlinedInput-root.Mui-focused": {
    boxShadow: "var(--shadow-focus)",
  },
  "& .MuiFormHelperText-root": { margin: "6px 0 0", fontSize: 12 },
} as const satisfies SxProps<Theme>;

export const accentSx = {
  fontStyle: "italic",
  color: "var(--color-accent)",
} as const satisfies SxProps<Theme>;
