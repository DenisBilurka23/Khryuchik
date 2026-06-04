import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";
import type { AccountOrder } from "@/types/order";
import type { AuthProvider } from "@/types/users";
import type { CountryCode } from "@/utils";

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
  country: CountryCode;
  homeHref: string;
  user: AccountPageUser;
  orders: AccountOrder[];
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