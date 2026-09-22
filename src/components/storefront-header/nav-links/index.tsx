"use client";

import { Button, Stack } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { isNavItemActive } from "@/utils/active-nav";

import { HeaderAboutMenu } from "./about-menu";
import type { HeaderNavLinksProps } from "./types";
import { isHeaderAboutNavItem, navItemSx } from "./utils";

export const HeaderNavLinks = ({ items }: HeaderNavLinksProps) => {
  const pathname = usePathname();
  const aboutItems = items.filter(isHeaderAboutNavItem);

  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      {items.map((item) => {
        const active = isNavItemActive(pathname, item.href);

        return (
          <Button
            key={item.key}
            component={Link}
            href={item.href}
            color="inherit"
            disableRipple
            aria-current={active ? "page" : undefined}
            sx={{
              ...navItemSx(active),
              display: isHeaderAboutNavItem(item)
                ? { xs: "none", xl: "inline-flex" }
                : "inline-flex",
            }}
          >
            {item.label}
          </Button>
        );
      })}

      {aboutItems.length > 0 && (
        <HeaderAboutMenu
          items={aboutItems}
          sx={{ display: { xs: "inline-flex", xl: "none" } }}
        />
      )}
    </Stack>
  );
};

export type { HeaderNavLinksProps } from "./types";
