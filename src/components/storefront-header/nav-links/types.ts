import type { HeaderAboutNavKey } from "@/constants/navigation";

export type HeaderNavLink = {
  key: string;
  label: string;
  href: string;
};

export type HeaderAboutNavItem = HeaderNavLink & {
  key: HeaderAboutNavKey;
};

export type HeaderNavLinksProps = {
  items: HeaderNavLink[];
};
