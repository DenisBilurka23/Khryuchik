"use client";

import { useRef } from "react";

import { Box, Checkbox, Stack, TextField } from "@mui/material";

import { ModalButton } from "@/components/modal-button";
import {
  AdminCheckboxField,
  AdminConfirmSubmitButton,
  AdminSectionCard,
  AdminStatusChip,
} from "@/components/admin-page-shared";

import type { AdminCategoryCardProps } from "./types";

export const AdminCategoryCard = ({
  category,
  title,
  labels,
  sharedStatus,
  saveAction, 
  deleteAction,
}: AdminCategoryCardProps) => {
  const deleteFormRef = useRef<HTMLFormElement>(null);
  const deletionDisabled = category.itemsCount > 0 || category.key === "books";
  const deleteBlockedReason = category.key === "books"
    ? labels.deleteProtectedHint
    : category.itemsCount > 0
      ? `${labels.deleteBlockedHint}: ${category.itemsCount} ${labels.itemsLabel}`
      : null;

  const handleDeleteConfirm = () => {
    const form = deleteFormRef.current;

    if (!form) {
      return false;
    }

    form.requestSubmit();
  };

  return (
    <AdminSectionCard
      title={title}
      description={`/${category.key} • ${category.itemsCount} ${labels.itemsLabel}`}
      action={(
        <Stack direction="row" gap={1} flexWrap="wrap">
          <AdminStatusChip
            label={category.isActive ? sharedStatus.active : sharedStatus.hidden}
            tone={category.isActive ? "success" : "neutral"}
          />
          <AdminStatusChip
            label={category.visibleInHomeTabs ? sharedStatus.homeTabs : sharedStatus.shopOnly}
            tone={category.visibleInHomeTabs ? "info" : "neutral"}
          />
        </Stack>
      )}
    >
      <form ref={deleteFormRef} action={deleteAction}>
        <input type="hidden" name="key" value={category.key} />
      </form>

      <form action={saveAction}>
        <Stack gap={2}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: 2 }}>
            <TextField label={labels.fields.key} name="key" defaultValue={category.key} required slotProps={{ input: { readOnly: true } }} />
            <TextField label={labels.fields.sortOrder} name="sortOrder" type="number" defaultValue={category.sortOrder} />
            <TextField label={labels.fields.ruLabel} name="ru.label" defaultValue={category.translations.ru?.label ?? ""} required />
            <TextField label={labels.fields.enLabel} name="en.label" defaultValue={category.translations.en?.label ?? ""} required />
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <AdminCheckboxField control={<Checkbox name="isActive" defaultChecked={category.isActive} />} label={labels.toggles.isActive} />
            <AdminCheckboxField control={<Checkbox name="visibleInShop" defaultChecked={category.visibleInShop} />} label={labels.toggles.visibleInShop} />
            <AdminCheckboxField control={<Checkbox name="visibleInHomeTabs" defaultChecked={category.visibleInHomeTabs} />} label={labels.toggles.visibleInHomeTabs} />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
            <ModalButton
              label={labels.deleteButton}
              onConfirmAction={handleDeleteConfirm}
              dialogTitle={labels.deleteDialogTitle}
              dialogDescription={labels.deleteDialogDescription}
              confirmLabel={labels.confirmDeleteButton}
              cancelLabel={labels.cancelDeleteButton}
              disabled={deletionDisabled}
              tooltip={deleteBlockedReason ?? undefined}
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

export type { AdminCategoryCardProps } from "./types";