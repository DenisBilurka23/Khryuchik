"use client";

import { Button, Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdminPrintEditorSourceFieldProps } from "./types";

export const AdminPrintEditorSourceField = ({
  title,
  label,
  accept,
  size,
  disabled,
  onFileAction,
}: AdminPrintEditorSourceFieldProps) => {
  const tEditor = useTranslations("adminPage.productForm.jetprint.editor");

  return (
    <Stack gap={1}>
      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>
      {size ? (
        <Typography variant="body2" color="text.secondary">
          {tEditor("size", { width: size.width, height: size.height })}
        </Typography>
      ) : null}
      <Button component="label" variant="outlined" disabled={disabled}>
        {label}
        <input
          hidden
          type="file"
          accept={accept}
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              void onFileAction(file);
            }
          }}
        />
      </Button>
    </Stack>
  );
};

export type { AdminPrintEditorSourceFieldProps } from "./types";
