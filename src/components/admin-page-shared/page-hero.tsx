import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import type { AdminPageHeroProps } from "./types";

export const AdminPageHero = ({
  eyebrow,
  title,
  description,
  actions,
  aside,
}: AdminPageHeroProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: "32px",
        border: "1px solid #F0DFC8",
        background:
          "radial-gradient(circle at top left, rgba(247,201,209,0.45), transparent 30%), radial-gradient(circle at right, rgba(255,224,167,0.35), transparent 28%), #fff",
      }}
    >
      <Stack direction={{ xs: "column", xl: "row" }} justifyContent="space-between" gap={3}>
        <Stack gap={2} sx={{ maxWidth: 820 }}>
          <Chip label={eyebrow} sx={{ alignSelf: "flex-start", bgcolor: "#FCE5EA", fontWeight: 800 }} />
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 52 } }}>
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1.5, lineHeight: 1.8 }}>
              {description}
            </Typography>
          </Box>
          {actions}
        </Stack>
        {aside ? aside : null}
      </Stack>
    </Paper>
  );
};