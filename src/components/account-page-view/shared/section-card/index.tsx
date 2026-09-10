import { Card, CardContent, Stack, Typography } from "@mui/material";

import { inputFieldSx } from "@/theme/sx";

import type { SectionCardProps } from "./types";

const cardSx = {
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-plate)",
  boxShadow: "var(--shadow-panel)",
} as const;

const contentSx = {
  ...inputFieldSx,
  p: { xs: 2.5, md: "28px 32px" },
  "&:last-child": { pb: { xs: 2.5, md: "28px" } },
} as const;

const headerSx = {
  mb: 2.5,
  gap: 2,
} as const;

const titleSx = {
  fontSize: { xs: 22, md: 26 },
  fontWeight: 700,
  lineHeight: 1.2,
} as const;

export const SectionCard = ({ title, action, children }: SectionCardProps) => {
  return (
    <Card sx={cardSx}>
      <CardContent sx={contentSx}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={headerSx}
        >
          <Typography sx={titleSx}>{title}</Typography>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
};

export type { SectionCardProps } from "./types";
