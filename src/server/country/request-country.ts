import "server-only";

import { headers } from "next/headers";

import {
  COUNTRY_HEADER,
  defaultCountry,
  getCountryFromCookieHeader,
  isCountryCode,
} from "@/utils";

export const getRequestCountry = async () => {
  const requestHeaders = await headers();
  const cookieCountry = getCountryFromCookieHeader(
    requestHeaders.get("cookie"),
  );

  if (isCountryCode(cookieCountry)) {
    return cookieCountry;
  }

  const requestCountry = requestHeaders.get(COUNTRY_HEADER);

  return isCountryCode(requestCountry) ? requestCountry : defaultCountry;
};