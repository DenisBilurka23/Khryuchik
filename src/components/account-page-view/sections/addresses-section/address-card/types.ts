import type { Locale } from "@/i18n/config";
import type { UserShippingAddress } from "@/types/users";

export type AddressCardProps = {
  address: UserShippingAddress;
  locale: Locale;
  isCurrent: boolean;
  isSelecting: boolean;
  isBusy: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
};
