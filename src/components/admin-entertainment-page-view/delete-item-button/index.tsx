"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { ModalButton } from "@/components/modal-button";

import type { DeleteEntertainmentItemButtonProps } from "./types";

export const DeleteEntertainmentItemButton = ({
  slug,
  action,
  icon,
  iconOnly = false,
  size = "medium",
}: DeleteEntertainmentItemButtonProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
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
        <input type="hidden" name="slug" value={slug} />
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

export type { DeleteEntertainmentItemButtonProps } from "./types";
