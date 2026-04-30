"use client";

import { useRef } from "react";

import { ModalButton } from "@/components/modal-button";

import type { DeleteProductButtonProps } from "./types";

export const DeleteProductButton = ({
  productId,
  action,
  label,
  dialogTitle,
  dialogDescription,
  confirmLabel,
  cancelLabel,
  tooltip,
  ariaLabel,
  icon,
  iconOnly = false,
  size = "medium",
}: DeleteProductButtonProps) => {
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
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="formMode" value="edit" />
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
      />
    </>
  );
};

export type { DeleteProductButtonProps } from "./types";
