import type { ReactNode } from "react";

export type DeleteEntertainmentItemButtonProps = {
  slug: string;
  action: (formData: FormData) => Promise<void>;
  icon?: ReactNode;
  iconOnly?: boolean;
  size?: "small" | "medium" | "large";
};
