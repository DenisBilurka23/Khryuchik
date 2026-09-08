import { Box, IconButton } from "@mui/material";
import Link from "next/link";

import { getSocialIcon } from "./icons";
import type { FooterSocialLinksProps } from "./types";

export const FooterSocialLinks = ({ items }: FooterSocialLinksProps) => {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
      {items.map((item) => {
        const Icon = getSocialIcon(item.key);
        const isExternal = item.href.startsWith("http");

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-label={item.label}
            style={{ display: "inline-flex" }}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <IconButton
              component="span"
              sx={{
                width: 44,
                height: 44,
                color: "var(--color-white)",
                background: "var(--color-accent)",
                "&:hover": { background: "var(--color-action)" },
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          </Link>
        );
      })}
    </Box>
  );
};

export type { FooterSocialItem, FooterSocialLinksProps } from "./types";
