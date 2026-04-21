import { Card, CardContent, Typography } from "@mui/material";

import type { AdminStatCardProps } from "./types";

export const AdminStatCard = ({ title, value, note }: AdminStatCardProps) => {
  return (
    <Card sx={{ border: "1px solid #F0DFC8", height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography sx={{ mt: 1, fontSize: 34, fontWeight: 800 }}>{value}</Typography>
        <Typography sx={{ mt: 0.75 }} color="text.secondary">
          {note}
        </Typography>
      </CardContent>
    </Card>
  );
};

export type { AdminStatCardProps } from "./types";