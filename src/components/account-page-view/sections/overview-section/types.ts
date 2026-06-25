import type { Locale } from "@/i18n/config";
import type { AccountOrder } from "@/types/order";
import type { AccountDownload } from "@/types/download";
import type { UserShippingAddress } from "@/types/users";

import type { ProfileEditorState } from "@/hooks/useProfileEditor.types";

export type OverviewSectionProps = {
  locale: Locale;
  orders: AccountOrder[];
  downloads: AccountDownload[];
  addresses: UserShippingAddress[];
  selectedShippingAddressId: string | null;
  profileEditor: ProfileEditorState;
};
