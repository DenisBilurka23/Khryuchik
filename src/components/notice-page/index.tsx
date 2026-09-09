import {
  Box,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import { PageShell } from "@/components/storefront/page-shell";

import type { NoticePageProps } from "./types";

const labelSx = {
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  fontSize: 12,
  fontWeight: 700,
  color: "primary.main",
} as const;

export const NoticePage = ({
  title,
  label,
  text,
  children,
}: NoticePageProps) => (
  <PageShell>
    <Box sx={{ pt: { xs: 6, md: 10 } }}>
      <Container maxWidth="sm">
        <Card sx={{ border: "1px solid var(--color-border)" }}>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Stack spacing={3} alignItems="flex-start">
              <Typography variant="h1" sx={{ fontSize: { xs: 32, md: 44 } }}>
                {title}
              </Typography>

              {label ? <Typography sx={labelSx}>{label}</Typography> : null}

              <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                {text}
              </Typography>

              {children}
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  </PageShell>
);

export type { NoticePageProps } from "./types";
