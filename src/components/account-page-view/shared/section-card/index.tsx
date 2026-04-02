import { Card, CardContent, Stack, Typography } from "@mui/material";

import type { SectionCardProps } from "./types";

export const SectionCard = ({ title, action, children }: SectionCardProps) => {
  return (
    <Card sx={{ border: "1px solid #F0DFC8" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2.5 }}
        >
          <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{title}</Typography>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
};

export type { SectionCardProps } from "./types";