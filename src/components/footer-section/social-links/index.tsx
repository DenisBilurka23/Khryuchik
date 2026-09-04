import { Box, IconButton } from "@mui/material";
import Link from "next/link";

import { getSocialIcon } from "./icons";
import styles from "./social-links.module.css";
import type { FooterSocialLinksProps } from "./types";

export const FooterSocialLinks = ({ items }: FooterSocialLinksProps) => {
  return (
    <Box className={styles.list}>
      {items.map((item) => {
        const Icon = getSocialIcon(item.key);
        const isExternal = item.href.startsWith("http");

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-label={item.label}
            className={styles.link}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <IconButton component="span" className={styles.button}>
              <Icon fontSize="small" />
            </IconButton>
          </Link>
        );
      })}
    </Box>
  );
};

export type { FooterSocialItem, FooterSocialLinksProps } from "./types";
