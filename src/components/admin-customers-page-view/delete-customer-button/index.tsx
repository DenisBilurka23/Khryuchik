"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { ModalButton } from "@/components/modal-button";

import type { DeleteCustomerButtonProps } from "./types";

export const DeleteCustomerButton = ({
  userId,
  action,
  source = "list",
  icon,
  iconOnly = false,
  size = "medium",
  disabled = false,
}: DeleteCustomerButtonProps) => {
  const tForm = useTranslations("adminPage.customers.form");
  const formRef = useRef<HTMLFormElement>(null);
  const label = tForm("deleteButton");

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
        dialogTitle={tForm("deleteDialogTitle")}
        dialogDescription={tForm("deleteDialogDescription")}
        confirmLabel={tForm("confirmDeleteButton")}
        cancelLabel={tForm("cancelDeleteButton")}
        tooltip={label}
        ariaLabel={label}
        icon={icon}
        iconOnly={iconOnly}
        size={size}
        disabled={disabled}
      />
    </>
  );
};

export type { DeleteCustomerButtonProps } from "./types";