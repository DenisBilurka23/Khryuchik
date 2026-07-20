import "server-only";

import { headers } from "next/headers";

import {
  getActiveRegionCodes,
  getDefaultRegionCode,
} from "@/server/localization/localization.service";
import { COUNTRY_HEADER, readCountryCookie } from "@/utils";

export const getRequestCountry = async () => {
  const requestHeaders = await headers();
  const [activeCodes, defaultRegion] = await Promise.all([
    getActiveRegionCodes(),
    getDefaultRegionCode(),
  ]);
  const isActive = (value: string | null | undefined): value is string =>
    Boolean(value && activeCodes.includes(value));

  const cookieCountry = readCountryCookie(requestHeaders.get("cookie"));

  if (isActive(cookieCountry)) {
    return cookieCountry;
  }

  const requestCountry = requestHeaders.get(COUNTRY_HEADER);

  return isActive(requestCountry) ? requestCountry : defaultRegion;
};
