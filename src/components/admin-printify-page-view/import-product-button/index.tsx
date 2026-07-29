"use client";

import { useFormStatus } from "react-dom";
import { Button, CircularProgress } from "@mui/material";

import type {
  ImportPrintifyProductButtonProps,
  SubmitButtonProps,
} from "./types";

const SubmitButton = ({ label, pendingLabel }: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="contained"
      size="small"
      disabled={pending}
      startIcon={
        pending ? <CircularProgress size={16} color="inherit" /> : undefined
      }
    >
      {pending ? pendingLabel : label}
    </Button>
  );
};

export const ImportPrintifyProductButton = ({
  printifyProductId,
  action,
  label,
  pendingLabel,
}: ImportPrintifyProductButtonProps) => (
  <form action={action}>
    <input type="hidden" name="printifyProductId" value={printifyProductId} />
    <SubmitButton label={label} pendingLabel={pendingLabel} />
  </form>
);

export type { ImportPrintifyProductButtonProps } from "./types";
