import type { Locale } from "@/i18n/config";
import type { UserShippingAddress } from "@/types/users";

import type { CheckoutLabels } from "../../types";

export type SavedAddressesSectionProps = {
  addresses: UserShippingAddress[];
  selectedAddressId: string;
  onSelect: (addressId: string) => void;
  locale: Locale;
  labels: CheckoutLabels;
};
