"use client";

import { useRef } from "react";

import { ModalButton } from "@/components/modal-button";

import type { DeleteCustomerButtonProps } from "./types";

export const DeleteCustomerButton = ({
  userId,
  action,
  label,
  dialogTitle,
  dialogDescription,
  confirmLabel,
  cancelLabel,
  source = "list",
  tooltip,
  ariaLabel,
  icon,
  iconOnly = false,
  size = "medium",
  disabled = false,
}: DeleteCustomerButtonProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleConfirm = () => {
    const form = formRef.current;

    if (!form) {
      return false;
    }

    form.requestSubmit();
  };

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="userId" value={userId} />
        <input type="hidden" name="source" value={source} />
      </form>

      <ModalButton
        label={label}
        onConfirmAction={handleConfirm}
        dialogTitle={dialogTitle}
        dialogDescription={dialogDescription}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        tooltip={tooltip}
        ariaLabel={ariaLabel}
        icon={icon}
        iconOnly={iconOnly}
        size={size}
        disabled={disabled}
      />
    </>
  );
};

export type { DeleteCustomerButtonProps } from "./types";