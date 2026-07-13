import type { ReactNode } from "react";

export type HeaderNavLink = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
};

export type HeaderNavLinksProps = {
  items: HeaderNavLink[];
};
