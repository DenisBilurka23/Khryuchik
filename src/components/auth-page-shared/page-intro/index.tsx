import { Chip, Stack, Typography } from "@mui/material";

import type { AuthPageIntroProps } from "./types";

export const AuthPageIntro = ({
  eyebrow,
  title,
  lead,
  chips,
}: AuthPageIntroProps) => (
  <>
    <Stack spacing={1.5}>
      <Typography
        sx={{
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          fontSize: 13,
          fontWeight: 700,
          color: "primary.main",
        }}
      >
        {eyebrow}
      </Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 34, md: 52 } }}>
        {title}
      </Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 620, lineHeight: 1.8 }}>
        {lead}
      </Typography>
    </Stack>

    {chips?.length ? (
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {chips.map((chip) => (
          <Chip
            key={chip}
            label={chip}
            sx={{ bgcolor: "#fff", border: "1px solid #E8D6BF" }}
          />
        ))}
      </Stack>
    ) : null}
  </>
);

export type { AuthPageIntroProps } from "./types";