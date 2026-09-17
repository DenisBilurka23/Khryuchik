import type { ReactNode } from "react";

import type { Locale } from "@/i18n/config";

export type StorefrontLayoutShellProps = {
  children: ReactNode;
  locale?: Locale;
};
