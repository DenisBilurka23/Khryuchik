import { Box, Stack, Typography } from "@mui/material";

import type { AuthSectionHeaderProps } from "./types";

export const AuthSectionHeader = ({
  title,
  description,
  icon,
  iconBackground,
}: AuthSectionHeaderProps) => (
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: "20px",
        bgcolor: iconBackground,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontWeight: 800, fontSize: 22 }}>{title}</Typography>
      {description ? <Typography color="text.secondary">{description}</Typography> : null}
    </Box>
  </Stack>
);

export type { AuthSectionHeaderProps } from "./types";