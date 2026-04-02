import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import type { AccountPageDictionary } from "@/i18n/types";

export type AccountPageUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export type AccountPageViewProps = {
  locale: Locale;
  dictionary: AccountPageDictionary;
  homeHref: string;
  user: AccountPageUser;
};

export type SectionKey =
  | "overview"
  | "orders"
  | "books"
  | "addresses"
  | "favorites"
  | "settings"
  | "logout";

export type SidebarItemProps = {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
};

export type AccountSidebarItem = {
  key: SectionKey;
  label: string;
  icon: ReactNode;
};

export type SectionCardProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};