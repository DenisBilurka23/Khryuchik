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
  onRatingChange: (rating: number | null) => void;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};
