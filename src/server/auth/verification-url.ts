import "server-only";

import type { Locale } from "@/i18n/config";
import { getAppOrigin } from "@/server/email/transport";
import { getLocalizedPath } from "@/utils";

export const buildEmailVerificationUrl = (locale: Locale, token: string) =>
  `${getAppOrigin()}${getLocalizedPath(locale, `/verify-email/${token}`)}`;
