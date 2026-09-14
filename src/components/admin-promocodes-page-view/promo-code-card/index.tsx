"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";

import { Box, Checkbox, Stack, TextField } from "@mui/material";

import { ModalButton } from "@/components/modal-button";
import {
  AdminCheckboxField,
  AdminConfirmSubmitButton,
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import { MAX_PROMO_PERCENT, MIN_PROMO_PERCENT } from "@/constants/promo";

import type { AdminPromoCodeCardProps } from "./types";

export const AdminPromoCodeCard = ({
  promoCode,
  description,
  saveAction,
  deleteAction,
}: AdminPromoCodeCardProps) => {
  const tPromoCodes = useTranslations("adminPage.promocodes");
  const tShared = useTranslations("adminPage.shared");
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const labels = {
    deleteButton: tPromoCodes("deleteButton"),
    deleteDialogTitle: tPromoCodes("deleteDialogTitle"),
    deleteDialogDescription: tPromoCodes("deleteDialogDescription"),
    confirmDeleteButton: tPromoCodes("confirmDeleteButton"),
    cancelDeleteButton: tPromoCodes("cancelDeleteButton"),
    updateButton: tPromoCodes("updateButton"),
    fields: {
      code: tPromoCodes("fields.code"),
      percentOff: tPromoCodes("fields.percentOff"),
    },
    toggles: {
      isActive: tPromoCodes("toggles.isActive"),
    },
  };

  const handleDeleteConfirm = () => {
    const form = deleteFormRef.current;

    if (!form) {
      return false;
    }

    form.requestSubmit();
  };

  return (
    <AdminSectionCard
      title={promoCode.code}
      description={description}
      action={(
        <AdminStatusChip
          label={
            promoCode.isActive
              ? tShared("status.active")
              : tShared("status.hidden")
          }
          tone={promoCode.isActive ? "success" : "neutral"}
        />
      )}
    >
      <form ref={deleteFormRef} action={deleteAction}>
        <input type="hidden" name="code" value={promoCode.code} />
      </form>

      <form action={saveAction}>
        <Stack gap={2}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            <TextField
              label={labels.fields.code}
              name="code"
              defaultValue={promoCode.code}
              required
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              label={labels.fields.percentOff}
              name="percentOff"
              type="number"
              defaultValue={promoCode.percentOff}
              required
              slotProps={{
                htmlInput: { min: MIN_PROMO_PERCENT, max: MAX_PROMO_PERCENT },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <AdminCheckboxField
              control={<Checkbox name="isActive" defaultChecked={promoCode.isActive} />}
              label={labels.toggles.isActive}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <ModalButton
              label={labels.deleteButton}
              onConfirmAction={handleDeleteConfirm}
              dialogTitle={labels.deleteDialogTitle}
              dialogDescription={labels.deleteDialogDescription}
              confirmLabel={labels.confirmDeleteButton}
              cancelLabel={labels.cancelDeleteButton}
            />
            <AdminConfirmSubmitButton
              variant="outlined"
              label={labels.updateButton}
            />
          </Box>
        </Stack>
      </form>
    </AdminSectionCard>
  );
};

export type { AdminPromoCodeCardProps } from "./types";
