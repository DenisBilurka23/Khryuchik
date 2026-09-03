import { IconButton, Stack } from "@mui/material";
import Link from "next/link";

import { getSocialIcon } from "./icons";
import type { FooterSocialLinksProps } from "./types";

export const FooterSocialLinks = ({ items }: FooterSocialLinksProps) => {
  return (
    <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.5 }}>
      {items.map((item) => {
        const Icon = getSocialIcon(item.key);
        const isExternal = item.href.startsWith("http");

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-label={item.label}
            style={{ display: "inline-flex", textDecoration: "none" }}
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
                bgcolor: "var(--color-accent)",
                "&:hover": { bgcolor: "var(--color-action)" },
              }}
            >
              <Icon fontSize="small" />
            </IconButton>
          </Link>
        );
      })}
    </Stack>
  );
};

export type { FooterSocialItem, FooterSocialLinksProps } from "./types";
