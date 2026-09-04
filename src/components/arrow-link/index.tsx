import { Box } from "@mui/material";
import Link from "next/link";

import styles from "./arrow-link.module.css";
import type { ArrowLinkProps } from "./types";

export const ArrowLink = ({
  href,
  label,
  size = "md",
  className,
}: ArrowLinkProps) => {
  return (
    <Box
      component="span"
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
    >
      <Link
        href={href}
        className={`${styles.link} ${size === "sm" ? styles.linkSm : ""}`}
      >
        {label}
        <span aria-hidden className={styles.arrow}>
          →
        </span>
      </Link>
    </Box>
  );
};

export type { ArrowLinkProps, ArrowLinkSize } from "./types";
