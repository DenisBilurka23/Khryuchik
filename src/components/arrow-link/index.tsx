import { Box } from "@mui/material";
import Link from "next/link";

import styles from "./arrow-link.module.css";
import type { ArrowLinkProps } from "./types";

export const ArrowLink = ({ href, label, sx }: ArrowLinkProps) => {
  return (
    <Box component="span" className={styles.wrapper} sx={sx}>
      <Link href={href} className={styles.link}>
        {label}
        <span aria-hidden className={styles.arrow}>
          →
        </span>
      </Link>
    </Box>
  );
};

export type { ArrowLinkProps } from "./types";
