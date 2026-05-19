"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { ModalButton } from "@/components/modal-button";

import type { DeleteProductButtonProps } from "./types";

export const DeleteProductButton = ({
  productId,
  action,
  icon,
  iconOnly = false,
  size = "medium",
}: DeleteProductButtonProps) => {
  const tForm = useTranslations("adminPage.productForm");
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
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="formMode" value="edit" />
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
      />
    </>
  );
};

export type { DeleteProductButtonProps } from "./types";
