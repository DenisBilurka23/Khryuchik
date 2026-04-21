import { Card, CardContent, Stack, Typography } from "@mui/material";

import type { AdminSectionCardProps } from "./types";

export const AdminSectionCard = ({
  title,
  description,
  action,
  children,
}: AdminSectionCardProps) => {
  return (
    <Card sx={{ border: "1px solid #F0DFC8", bgcolor: "#fff" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          gap={1.5}
          mb={2.5}
        >
          <Stack gap={0.5}>
            <Typography variant="h6" fontWeight={800}>
              {title}
            </Typography>
            {description ? (
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            ) : null}
          </Stack>
          {action}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
};

export type { AdminSectionCardProps } from "./types";