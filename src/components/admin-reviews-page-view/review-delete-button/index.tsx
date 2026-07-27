"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { ModalButton } from "@/components/modal-button";

import type { AdminReviewDeleteButtonProps } from "./types";

export const AdminReviewDeleteButton = ({
  reviewId,
  action,
  icon,
  iconOnly = true,
  size = "small",
}: AdminReviewDeleteButtonProps) => {
  const tDelete = useTranslations("adminPage.reviews.delete");
  const formRef = useRef<HTMLFormElement>(null);
  const label = tDelete("button");

  const handleConfirm = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="reviewId" value={reviewId} />
      </form>

      <ModalButton
        label={label}
        onConfirmAction={handleConfirm}
        dialogTitle={tDelete("dialogTitle")}
        dialogDescription={tDelete("dialogDescription")}
        confirmLabel={tDelete("confirmLabel")}
        cancelLabel={tDelete("cancelLabel")}
        tooltip={label}
        ariaLabel={label}
        icon={icon}
        iconOnly={iconOnly}
        size={size}
      />
    </>
  );
};

export type { AdminReviewDeleteButtonProps } from "./types";
