import type { Locale } from "@/i18n/config";
import type { CountryCode } from "@/utils";
import type { ReactNode } from "react";

export type AdminLayoutShellProps = {
  email: string;
  profileHref: string;
  locale: Locale;
  country: CountryCode;
  children: ReactNode;
};