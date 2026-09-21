export type OrderReviewStatus = "idle" | "submitting" | "success";

export type UseOrderReviewParams = {
  productId: string;
  productSlug: string;
};

export type UseOrderReviewResult = {
  isOpen: boolean;
  rating: number | null;
  text: string;
  status: OrderReviewStatus;
  errorMessage: string | null;
  hasSubmitted: boolean;
  openForm: () => void;
  closeForm: () => void;
  setRating: (rating: number | null) => void;
  setText: (text: string) => void;
  submitForm: () => Promise<void>;
};
