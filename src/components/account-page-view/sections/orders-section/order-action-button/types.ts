import type { ReactNode } from "react";

export type OrderActionButtonTone = "accent" | "done";

export type OrderActionButtonProps = {
  tone?: OrderActionButtonTone;
  label: string;
  icon: ReactNode;
  onClickAction?: () => void;
};
