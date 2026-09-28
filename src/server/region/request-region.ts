import "server-only";

import { headers } from "next/headers";

import {
  getActiveRegionCodes,
  getDefaultRegionCode,
} from "@/server/localization/localization.service";
import type { RegionCode } from "@/types/localization";
import {
  COUNTRY_HEADER,
  defaultCountry,
  getCountryTimeZone,
  getRegionForCountry,
  readRegionCookie,
} from "@/utils";

export const getRequestRegion = async (): Promise<RegionCode> => {
  const requestHeaders = await headers();
  const [activeCodes, defaultRegion] = await Promise.all([
    getActiveRegionCodes(),
    getDefaultRegionCode(),
  ]);
  const requestCountry = requestHeaders.get(COUNTRY_HEADER);
  const candidates = [
    readRegionCookie(requestHeaders.get("cookie")),
    requestCountry ? getRegionForCountry(requestCountry) : null,
  ];

  return (
    candidates.find(
      (region): region is RegionCode =>
        region !== null && activeCodes.includes(region),
    ) ?? defaultRegion
  );
};

export const getRequestTimeZone = async () =>
  getCountryTimeZone((await headers()).get(COUNTRY_HEADER) ?? defaultCountry);
