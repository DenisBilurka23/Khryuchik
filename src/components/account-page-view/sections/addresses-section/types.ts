import type { Locale } from "@/i18n/config";
import type { UserShippingAddress } from "@/types/users";
import type { CountryCode } from "@/utils";

export type AddressesSectionProps = {
  locale: Locale;
  country: CountryCode;
  initialAddresses: UserShippingAddress[];
  initialSelectedId: string | null;
  onAddressesChange?: (addresses: UserShippingAddress[], selectedId: string | null) => void;
};
