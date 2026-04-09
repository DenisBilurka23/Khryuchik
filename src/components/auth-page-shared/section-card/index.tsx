import { Card, CardContent } from "@mui/material";

import type { AuthSectionCardProps } from "./types";

export const AuthSectionCard = ({ children }: AuthSectionCardProps) => (
  <Card
    sx={{
      border: "1px solid #F0DFC8",
      bgcolor: "rgba(255,255,255,0.86)",
    }}
  >
    <CardContent sx={{ p: { xs: 3, md: 4 } }}>{children}</CardContent>
  </Card>
);

export type { AuthSectionCardProps } from "./types";