import { headerAboutNavKeys } from "@/constants/navigation";

import type { HeaderAboutNavItem, HeaderNavLink } from "./types";

export const isHeaderAboutNavItem = (
  item: HeaderNavLink,
): item is HeaderAboutNavItem =>
  headerAboutNavKeys.some((aboutKey) => aboutKey === item.key);

export const navItemSx = (active: boolean) =>
  ({
    position: "relative",
    minHeight: 44,
    px: 1.5,
    fontSize: 15,
    fontWeight: active ? 600 : 500,
    whiteSpace: "nowrap",
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
      borderRadius: "var(--radius-pill)",
      backgroundColor: "var(--color-action)",
      opacity: active ? 1 : 0,
      transition: "opacity 0.2s ease",
    },
  }) as const;
