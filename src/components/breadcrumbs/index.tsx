import { Breadcrumbs as MuiBreadcrumbs, Typography } from "@mui/material";
import Link from "next/link";

import styles from "./breadcrumbs.module.css";
import type { BreadcrumbsProps } from "./types";

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <MuiBreadcrumbs separator="→" className={styles.root}>
      {items.map((item) =>
        item.href ? (
          <Link key={item.label} href={item.href} className={styles.link}>
            {item.label}
          </Link>
        ) : (
          <Typography
            key={item.label}
            component="span"
            className={styles.current}
          >
            {item.label}
          </Typography>
        ),
      )}
    </MuiBreadcrumbs>
  );
};

export type { BreadcrumbItem, BreadcrumbsProps } from "./types";
