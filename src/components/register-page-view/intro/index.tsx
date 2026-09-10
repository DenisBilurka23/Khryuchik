import { Box, Typography } from "@mui/material";

import { SectionEyebrow } from "@/components/section-eyebrow";
import { leadSx } from "@/theme/sx";

import type { RegisterIntroProps } from "./types";

const wrapperSx = {
  pt: { xs: 3, md: 4.5 },
} as const;

const titleSx = {
  mt: 2,
  fontSize: "clamp(32px, 3.8vw, 52px)",
  lineHeight: 1.08,
} as const;

const introLeadSx = {
  ...leadSx,
  maxWidth: "56ch",
  mt: 2,
  fontSize: { xs: 16, md: 18 },
} as const;

export const RegisterIntro = ({ eyebrow, title, lead }: RegisterIntroProps) => (
  <Box sx={wrapperSx}>
    <SectionEyebrow label={eyebrow} />

    <Typography variant="h1" sx={titleSx}>
      {title}
    </Typography>

    <Typography sx={introLeadSx}>{lead}</Typography>
  </Box>
);

export type { RegisterIntroProps } from "./types";
