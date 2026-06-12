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

import type { AdminLocaleCardProps } from "./types";

export const AdminLocaleCard = ({
  locale,
  saveAction,
  deleteAction,
}: AdminLocaleCardProps) => {
  const tLocalization = useTranslations("adminPage.localization");
  const tShared = useTranslations("adminPage.shared");
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const labels = {
    deleteButton: tLocalization("deleteButton"),
    deleteDialogTitle: tLocalization("deleteDialogTitle"),
    deleteDialogDescription: tLocalization("deleteDialogDescription"),
    confirmDeleteButton: tLocalization("confirmDeleteButton"),
    cancelDeleteButton: tLocalization("cancelDeleteButton"),
    deleteProtectedHint: tLocalization("deleteProtectedHint"),
    updateButton: tLocalization("updateButton"),
    defaultBadge: tLocalization("defaultBadge"),
    fields: {
      code: tLocalization("fields.code"),
      sortOrder: tLocalization("fields.sortOrder"),
    },
    toggles: {
      isActive: tLocalization("toggles.isActive"),
      isDefault: tLocalization("toggles.isDefault"),
    },
  };
  const sharedStatus = {
    active: tShared("status.active"),
    hidden: tShared("status.hidden"),
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
      title={locale.label}
      action={(
        <Stack direction="row" gap={1} flexWrap="wrap">
          <AdminStatusChip
            label={locale.isActive ? sharedStatus.active : sharedStatus.hidden}
            tone={locale.isActive ? "success" : "neutral"}
          />
          {locale.isDefault ? (
            <AdminStatusChip label={labels.defaultBadge} tone="info" />
          ) : null}
        </Stack>
      )}
    >
      <form ref={deleteFormRef} action={deleteAction}>
        <input type="hidden" name="code" value={locale.code} />
      </form>

      <form action={saveAction}>
        <Stack gap={2}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            <TextField label={labels.fields.code} name="code" defaultValue={locale.code} required slotProps={{ input: { readOnly: true } }} />
            <TextField label={labels.fields.sortOrder} name="sortOrder" type="number" defaultValue={locale.sortOrder} />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <AdminCheckboxField control={<Checkbox name="isActive" defaultChecked={locale.isActive} />} label={labels.toggles.isActive} />
            <AdminCheckboxField control={<Checkbox name="isDefault" defaultChecked={locale.isDefault} />} label={labels.toggles.isDefault} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <ModalButton
              label={labels.deleteButton}
              onConfirmAction={handleDeleteConfirm}
              dialogTitle={labels.deleteDialogTitle}
              dialogDescription={labels.deleteDialogDescription}
              confirmLabel={labels.confirmDeleteButton}
              cancelLabel={labels.cancelDeleteButton}
              disabled={locale.isDefault}
              tooltip={locale.isDefault ? labels.deleteProtectedHint : undefined}
            />
            <AdminConfirmSubmitButton variant="outlined" label={labels.updateButton} />
          </Box>
        </Stack>
      </form>
    </AdminSectionCard>
  );
};

export type { AdminLocaleCardProps } from "./types";
