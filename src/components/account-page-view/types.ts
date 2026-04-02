import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import type { AccountPageDictionary } from "@/i18n/types";
import type { AuthProvider } from "@/types/users";

export type AccountPageUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  image?: string | null;
  authProviders?: AuthProvider[];
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

export type AccountSidebarItem = {
  key: SectionKey;
  label: string;
  icon: ReactNode;
};