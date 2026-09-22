import type { OrderReviewStatus } from "@/hooks/useOrderReview";
import type { ProductType } from "@/types/catalog";

import type { OrderItemThumbnailViewModel } from "../../types";

export type ReviewDialogProps = {
  isOpen: boolean;
  productTitle: string;
  productType: ProductType | null;
  thumbnail: OrderItemThumbnailViewModel;
  caption: string;
  rating: number | null;
  text: string;
  status: OrderReviewStatus;
  errorMessage: string | null;
  onRatingChangeAction: (rating: number | null) => void;
  onTextChangeAction: (text: string) => void;
  onSubmitAction: () => void;
  onCloseAction: () => void;
};
