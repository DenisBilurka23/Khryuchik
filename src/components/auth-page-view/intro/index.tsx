import { Box, Typography } from "@mui/material";

import { leadSx } from "@/theme/sx";

import type { AuthIntroProps } from "./types";

const titleSx = {
  fontSize: "clamp(32px, 3.6vw, 48px)",
  lineHeight: 1.05,
} as const;

const introLeadSx = {
  ...leadSx,
  maxWidth: "52ch",
  mt: 2,
  fontSize: { xs: 16, md: 17 },
} as const;

export const AuthIntro = ({ title, lead }: AuthIntroProps) => (
  <Box>
    <Typography variant="h1" sx={titleSx}>
      {title}
    </Typography>

    <Typography sx={introLeadSx}>{lead}</Typography>
  </Box>
);

export type { AuthIntroProps } from "./types";
