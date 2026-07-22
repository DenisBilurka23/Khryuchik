import { COUNTRY_CURRENCY } from "@/constants/country-currency";

export const getCurrencyForCountry = (code: string): string | undefined =>
  COUNTRY_CURRENCY[code];
