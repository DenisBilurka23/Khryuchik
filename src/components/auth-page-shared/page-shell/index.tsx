import { Box, Card, CardContent, Stack } from "@mui/material";

import type { AuthPageShellProps } from "./types";

export const AuthPageShell = ({ children }: AuthPageShellProps) => (
  <Box
    sx={{
      minHeight: { xs: "auto", md: "calc(100vh - 140px)" },
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      py: { xs: 4, md: 8 },
    }}
  >
    <Card
      sx={{
        width: "100%",
        maxWidth: 960,
        border: "1px solid #F0DFC8",
        background:
          "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.35), transparent 28%), #fff",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 5 } }}>
        <Stack spacing={3.5}>{children}</Stack>
      </CardContent>
    </Card>
  </Box>
);

export type { AuthPageShellProps } from "./types";