"use client";

import { Box, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  AdminConfirmSubmitButton,
  AdminCountrySelectField,
  AdminSectionCard,
} from "@/components/admin-page-shared";

import type { AdminManufacturerFormProps } from "./types";

export const AdminManufacturerForm = ({
  locale,
  manufacturer,
  saveAction,
}: AdminManufacturerFormProps) => {
  const t = useTranslations("adminPage.shipping");

  return (
    <form action={saveAction}>
      <AdminSectionCard
        title={t("manufacturerTitle")}
        description={t("manufacturerDescription")}
      >
        <Stack gap={2}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, minmax(0, 1fr))",
              },
              gap: 2,
            }}
          >
            <TextField
              label={t("fields.name")}
              name="shipping.manufacturer.name"
              defaultValue={manufacturer?.name ?? ""}
            />
            <TextField
              label={t("fields.street")}
              name="shipping.manufacturer.street"
              defaultValue={manufacturer?.street ?? ""}
            />
            <TextField
              label={t("fields.city")}
              name="shipping.manufacturer.city"
              defaultValue={manufacturer?.city ?? ""}
            />
            <TextField
              label={t("fields.regionCode")}
              name="shipping.manufacturer.regionCode"
              defaultValue={manufacturer?.regionCode ?? ""}
            />
            <TextField
              label={t("fields.postalCode")}
              name="shipping.manufacturer.postalCode"
              defaultValue={manufacturer?.postalCode ?? ""}
            />
            <AdminCountrySelectField
              name="shipping.manufacturer.country"
              label={t("fields.country")}
              locale={locale}
              defaultValue={manufacturer?.country ?? ""}
              placeholder={t("fields.country")}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            {t("helpers.manufacturer")}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <AdminConfirmSubmitButton label={t("saveButton")} />
          </Box>
        </Stack>
      </AdminSectionCard>
    </form>
  );
};

export type { AdminManufacturerFormProps } from "./types";
