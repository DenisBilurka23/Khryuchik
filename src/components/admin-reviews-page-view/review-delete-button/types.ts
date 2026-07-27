import type { ReactNode } from "react";

export type AdminReviewDeleteButtonProps = {
  reviewId: string;
  action: (formData: FormData) => void | Promise<void>;
  icon?: ReactNode;
  iconOnly?: boolean;
  size?: "small" | "medium" | "large";
};
