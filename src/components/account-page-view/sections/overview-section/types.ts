import type { Locale } from "@/i18n/config";
import type { AccountOrder } from "@/types/order";
import type { ProductPreview } from "@/types/catalog";
import type { AccountDownload } from "@/types/download";
import type { UserReviewSummary } from "@/types/reviews";
import type { UserShippingAddress } from "@/types/users";

import type { ProfileEditorState } from "@/hooks/useProfileEditor.types";

export type OverviewSectionProps = {
  locale: Locale;
  timeZone: string;
  orders: AccountOrder[];
  orderProducts: Record<string, ProductPreview>;
  productReviews: Record<string, UserReviewSummary>;
  downloads: AccountDownload[];
  addresses: UserShippingAddress[];
  selectedShippingAddressId: string | null;
  profileEditor: ProfileEditorState;
  selectingAddressId: string | null;
  onAddAddress: () => void;
  onShowAllOrders: () => void;
  onShowAllBooks: () => void;
  onSelectAddress: (addressId: string) => void;
};
