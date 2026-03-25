import { Box, Button, Stack, Typography } from "@mui/material";

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
      mb={5}
    >
      <Box>
        <Typography className={styles.eyebrow}>{eyebrow}</Typography>
        <Typography variant="h2" sx={{ mt: 1, fontSize: { xs: 32, md: 42 } }}>
          {title}
        </Typography>
      </Box>

      {actionLabel ? (
        <Button
          href={actionHref}
          variant="outlined"
          color="inherit"
          className={styles.actionButton}
          sx={{ display: { xs: "none", md: "inline-flex" } }}
        >
          {actionLabel}
        </Button>
      ) : null}
    </Stack>
  );
};
