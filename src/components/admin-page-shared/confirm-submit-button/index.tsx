"use client";
import { Button, CircularProgress } from "@mui/material";
import { useFormStatus } from "react-dom";
import type { AdminConfirmSubmitButtonProps } from "./types";
export const AdminConfirmSubmitButton = ({
  label,
  pendingLabel,
  pending,
  disabled,
  startIcon,
  ...buttonProps
}: AdminConfirmSubmitButtonProps) => {
  const { pending: formPending } = useFormStatus();
  const isPending = pending ?? formPending;
  return (
    <Button
      type="submit"
      disabled={disabled || isPending}
      startIcon={
        isPending ? <CircularProgress size={16} color="inherit" /> : startIcon
      }
      aria-busy={isPending}
      {...buttonProps}
    >
      {isPending ? pendingLabel ?? label : label}
    </Button>
  );
};
export type { AdminConfirmSubmitButtonProps } from "./types";
