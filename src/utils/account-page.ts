import type { Locale } from "@/i18n/config";
import type { UserShippingAddress, UserShippingAddressInput } from "@/types/users";

import { getCountryDisplayName } from "./country";

export const splitName = (value: string | null | undefined) => {
  const normalizedName = value?.trim() ?? "";

  if (!normalizedName) {
    return { firstName: "", lastName: "" };
  }

  const [firstName = "", ...lastNameParts] = normalizedName.split(/\s+/);

  return {
    firstName,
    lastName: lastNameParts.join(" "),
  };
};

export const getUserShippingAddressLines = (
  address: UserShippingAddress,
  locale: Locale,
) => {
  const normalizedTitle = address.title.trim().toLowerCase();
  const normalizedLine1 = address.line1.trim().toLowerCase();
  const locality = [address.city, address.region, address.postalCode]
    .filter(Boolean)
    .join(", ");

  return [
    normalizedTitle === normalizedLine1 ? undefined : address.line1,
    address.line2,
    locality,
    getCountryDisplayName(locale, address.country),
  ].filter((line): line is string => Boolean(line));
};

export const getUserShippingAddressTitle = (address: UserShippingAddress) =>
  address.title.trim() || address.line1;

export const normalizeShippingAddressInput = (
  input: UserShippingAddressInput,
): UserShippingAddressInput => ({
  title: input.title.trim(),
  line1: input.line1.trim(),
  line2: input.line2?.trim() || undefined,
  city: input.city.trim(),
  region: input.region?.trim() || undefined,
  postalCode: input.postalCode?.trim() || undefined,
  country: input.country,
});