import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

import { SectionEyebrow } from "../section-eyebrow";

import styles from "./section-heading.module.css";
import type { SectionHeadingProps } from "./types";

export const SectionHeading = ({
  eyebrow,
  title,
  actionLabel,
  actionHref,
}: SectionHeadingProps) => {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", md: "flex-end" }}
      spacing={3}
      mb={4}
    >
      <Box>
        <SectionEyebrow label={eyebrow} />
        <Typography variant="h2" sx={{ mt: 1 }}>
          {title}
        </Typography>
      </Box>

      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Button
            component="span"
            variant="outlined"
            color="inherit"
            className={styles.actionButton}
            sx={{ display: { xs: "none", md: "inline-flex" } }}
          >
            {actionLabel}
          </Button>
        </Link>
      ) : null}
    </Stack>
  );
};
