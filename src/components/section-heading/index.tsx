import { Box, Button, Typography } from "@mui/material";
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
    <Box className={styles.root}>
      <Box>
        <SectionEyebrow label={eyebrow} />
        <Typography variant="h2" className={styles.title}>
          {title}
        </Typography>
      </Box>

      {actionLabel && actionHref ? (
        <Link href={actionHref} className={styles.actionLink}>
          <Button
            component="span"
            variant="outlined"
            className={styles.actionButton}
          >
            {actionLabel}
          </Button>
        </Link>
      ) : null}
    </Box>
  );
};
