"use client";

import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavItemActive } from "@/utils/active-nav";

import type { HeaderNavLinksProps } from "./types";

export const HeaderNavLinks = ({ items }: HeaderNavLinksProps) => {
  const pathname = usePathname();

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ display: { xs: "none", md: "flex" } }}
    >
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
              startIcon={item.icon}
              component="span"
              aria-current={active ? "page" : undefined}
              sx={{
                position: "relative",
                color: active ? "primary.main" : "#2a2522",
                transition: "color 0.2s ease",
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "primary.main",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  left: 16,
                  right: 16,
                  bottom: 4,
                  height: 2,
                  borderRadius: 2,
                  backgroundColor: "primary.main",
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
