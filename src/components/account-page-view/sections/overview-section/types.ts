import type { AccountDownloadMock } from "@/data/account-page-mock";
import type { Locale } from "@/i18n/config";
import type { AccountOrder } from "@/types/order";
import type { UserShippingAddress } from "@/types/users";

import type { ProfileEditorState } from "@/hooks/useProfileEditor.types";

export type OverviewSectionProps = {
  locale: Locale;
  orders: AccountOrder[];
  downloads: AccountDownloadMock[];
  addresses: UserShippingAddress[];
  selectedShippingAddressId: string | null;
  profileEditor: ProfileEditorState;
};
