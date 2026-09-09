import { Card, CardContent, Typography } from "@mui/material";

import type { CheckoutSectionCardProps } from "./types";

export const CheckoutSectionCard = ({
  title,
  children,
}: CheckoutSectionCardProps) => (
  <Card sx={{ border: "1px solid var(--color-border)" }}>
    <CardContent sx={{ p: 3 }}>
      <Typography sx={{ fontSize: 20, fontWeight: 800, mb: 2 }}>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
);

export type { CheckoutSectionCardProps } from "./types";
