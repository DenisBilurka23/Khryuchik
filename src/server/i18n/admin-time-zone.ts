import "server-only";

import { cookies } from "next/headers";

import { ADMIN_TIME_ZONE_COOKIE_NAME } from "@/i18n/config";
import { FALLBACK_TIME_ZONE, isSupportedTimeZone } from "@/utils";

export const resolveAdminTimeZone = async () => {
  const stored = (await cookies()).get(ADMIN_TIME_ZONE_COOKIE_NAME)?.value;

  return isSupportedTimeZone(stored) ? stored : FALLBACK_TIME_ZONE;
};
