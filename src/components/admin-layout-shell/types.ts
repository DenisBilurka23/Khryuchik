import type { Locale } from "@/i18n/config";
import type { AdminPageDictionary } from "@/i18n/types";
import type { AdminNavItem } from "@/types/admin";
import type { ReactNode } from "react";

export type AdminLayoutShellProps = {
  email: string;
  profileHref: string;
  locale: Locale;
  dictionary: AdminPageDictionary;
  navItems: AdminNavItem[];
  children: ReactNode;
};