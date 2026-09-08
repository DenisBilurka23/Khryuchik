import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

import { SectionEyebrow } from "../section-eyebrow";

import type { SectionHeadingProps } from "./types";

export const SectionHeading = ({
  eyebrow,
  title,
  actionLabel,
  actionHref,
}: SectionHeadingProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "flex-end" },
        justifyContent: "space-between",
        gap: 3,
        mb: 4,
      }}
    >
      <Box>
        <SectionEyebrow label={eyebrow} />
        <Typography variant="h2" sx={{ mt: 1 }}>
          {title}
        </Typography>
      </Box>

      {actionLabel && actionHref ? (
        <Link href={actionHref} style={{ flexShrink: 0 }}>
          <Button
            component="span"
            variant="outlined"
            sx={{
              display: { xs: "none", md: "inline-flex" },
              border: "1px solid var(--color-border-rose)",
              background: "var(--color-card)",
              color: "var(--color-text)",
              "&:hover": {
                borderColor: "var(--color-border-rose)",
                background: "var(--color-accent-pale)",
              },
            }}
          >
            {actionLabel}
          </Button>
        </Link>
      ) : null}
    </Box>
  );
};
