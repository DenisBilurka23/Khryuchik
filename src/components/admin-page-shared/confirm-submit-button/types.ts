import type { ButtonProps } from "@mui/material/Button";

export type AdminConfirmSubmitButtonProps = Omit<ButtonProps, "children" | "type"> & {
  label: string;
  pendingLabel?: string;
  pending?: boolean;
};

