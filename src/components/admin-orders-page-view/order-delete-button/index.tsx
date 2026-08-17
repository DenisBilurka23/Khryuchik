"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { ModalButton } from "@/components/modal-button";

import type { AdminOrderDeleteButtonProps } from "./types";

export const AdminOrderDeleteButton = ({
  orderId,
  action,
  disabledReason,
  icon,
  iconOnly = true,
  size = "small",
}: AdminOrderDeleteButtonProps) => {
  const tDelete = useTranslations("adminPage.orders.delete");
  const formRef = useRef<HTMLFormElement>(null);
  const label = tDelete("button");

  const handleConfirm = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name="orderId" value={orderId} />
      </form>

      <ModalButton
        label={label}
        onConfirmAction={handleConfirm}
        dialogTitle={tDelete("dialogTitle")}
        dialogDescription={tDelete("dialogDescription")}
        confirmLabel={tDelete("confirmLabel")}
        cancelLabel={tDelete("cancelLabel")}
        tooltip={disabledReason ?? label}
        ariaLabel={label}
        disabled={Boolean(disabledReason)}
        icon={icon}
        iconOnly={iconOnly}
        size={size}
      />
    </>
  );
};

export type { AdminOrderDeleteButtonProps } from "./types";
