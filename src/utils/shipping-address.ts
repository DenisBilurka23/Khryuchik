import type { ShippingQuoteRequest } from "@/types/order";

import { isRegionRequired } from "./country";
import { isPostalCodeValid } from "./postal-code";

const MIN_QUOTABLE_POSTAL_CODE_LENGTH = 3;

type ShippingQuoteAddress = ShippingQuoteRequest["address"];

export const isQuotableShippingAddress = (
  address: ShippingQuoteAddress | null,
) => {
  if (!address) {
    return false;
  }

  const postalCode = address.postalCode?.trim() ?? "";

  return (
    postalCode.length >= MIN_QUOTABLE_POSTAL_CODE_LENGTH &&
    isPostalCodeValid(postalCode) &&
    Boolean(address.line1?.trim()) &&
    Boolean(address.city?.trim()) &&
    (!isRegionRequired(address.country) || Boolean(address.region?.trim()))
  );
};
