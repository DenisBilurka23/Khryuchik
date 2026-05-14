import type { Locale } from "@/i18n/config";
import type { ReactNode } from "react";

export type AdminLayoutShellProps = {
  email: string;
  profileHref: string;
  locale: Locale;
  children: ReactNode;
};