import type { Locale } from "@/i18n/config";
import type { UserShippingAddress } from "@/types/users";

export type AddressesSectionProps = {
  locale: Locale;
  initialAddresses: UserShippingAddress[];
  initialSelectedId: string | null;
  onAddressesChange?: (addresses: UserShippingAddress[], selectedId: string | null) => void;
};
