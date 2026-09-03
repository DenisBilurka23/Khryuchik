"use client";

import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavItemActive } from "@/utils/active-nav";

import type { HeaderNavLinksProps } from "./types";

export const HeaderNavLinks = ({ items }: HeaderNavLinksProps) => {
  const pathname = usePathname();

  return (
    <Stack direction="row" spacing={0.5}>
      {items.map((item) => {
        const active = isNavItemActive(pathname, item.href);

        return (
          <Link
            key={item.key}
            href={item.href}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Button
              color="inherit"
              disableRipple
              component="span"
              aria-current={active ? "page" : undefined}
              sx={{
                position: "relative",
                minHeight: 44,
                px: 1.5,
                fontSize: 15,
                fontWeight: active ? 600 : 500,
                color: active ? "var(--color-action)" : "var(--color-text)",
                transition: "color 0.2s ease",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "var(--color-action)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 12,
                  right: 12,
                  bottom: 6,
                  height: 2,
                  borderRadius: 2,
                  backgroundColor: "var(--color-action)",
                  opacity: active ? 1 : 0,
                  transition: "opacity 0.2s ease",
                },
              }}
            >
              {item.label}
            </Button>
          </Link>
        );
      })}
    </Stack>
  );
};

export type { HeaderNavLinksProps } from "./types";
