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

import type { AdminRegionCardProps } from "./types";

export const AdminRegionCard = ({
  region,
  saveAction,
  deleteAction,
}: AdminRegionCardProps) => {
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
      regionCode: tLocalization("fields.regionCode"),
      currency: tLocalization("fields.currency"),
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
      title={region.label}
      description={`${region.code} • ${region.currency}`}
      action={(
        <Stack direction="row" gap={1} flexWrap="wrap">
          <AdminStatusChip
            label={region.isActive ? sharedStatus.active : sharedStatus.hidden}
            tone={region.isActive ? "success" : "neutral"}
          />
          {region.isDefault ? (
            <AdminStatusChip label={labels.defaultBadge} tone="info" />
          ) : null}
        </Stack>
      )}
    >
      <form ref={deleteFormRef} action={deleteAction}>
        <input type="hidden" name="code" value={region.code} />
      </form>

      <form action={saveAction}>
        <Stack gap={2}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: 2 }}>
            <TextField label={labels.fields.regionCode} name="code" defaultValue={region.code} required slotProps={{ input: { readOnly: true } }} />
            <TextField label={labels.fields.currency} name="currency" defaultValue={region.currency} required />
            <TextField label={labels.fields.sortOrder} name="sortOrder" type="number" defaultValue={region.sortOrder} />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <AdminCheckboxField control={<Checkbox name="isActive" defaultChecked={region.isActive} />} label={labels.toggles.isActive} />
            <AdminCheckboxField control={<Checkbox name="isDefault" defaultChecked={region.isDefault} />} label={labels.toggles.isDefault} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <ModalButton
              label={labels.deleteButton}
              onConfirmAction={handleDeleteConfirm}
              dialogTitle={labels.deleteDialogTitle}
              dialogDescription={labels.deleteDialogDescription}
              confirmLabel={labels.confirmDeleteButton}
              cancelLabel={labels.cancelDeleteButton}
              disabled={region.isDefault}
              tooltip={region.isDefault ? labels.deleteProtectedHint : undefined}
            />
            <AdminConfirmSubmitButton variant="outlined" label={labels.updateButton} />
          </Box>
        </Stack>
      </form>
    </AdminSectionCard>
  );
};

export type { AdminRegionCardProps } from "./types";
