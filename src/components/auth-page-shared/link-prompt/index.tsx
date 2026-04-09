import { Box, Typography } from "@mui/material";
import Link from "next/link";

import type { AuthLinkPromptProps } from "./types";

export const AuthLinkPrompt = ({
  href,
  label,
  prefix,
}: AuthLinkPromptProps) => (
  <Typography color="text.secondary">
    {prefix ? `${prefix} ` : null}
    <Box
      component={Link}
      href={href}
      sx={{ color: "primary.main", fontWeight: 700 }}
    >
      {label}
    </Box>
  </Typography>
);

export type { AuthLinkPromptProps } from "./types";