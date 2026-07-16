"use client";

import { Box, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  AdminConfirmSubmitButton,
  AdminSectionCard,
} from "@/components/admin-page-shared";

import { AdminSingleProductField } from "../single-product-field";
import type { AdminHeroEditorProps } from "./types";

export const AdminHeroEditor = ({
  locale,
  data,
  saveAction,
}: AdminHeroEditorProps) => {
  const t = useTranslations("adminPage.home");

  return (
    <form action={saveAction}>
      <AdminSectionCard
        title={t("sections.products.title")}
        description={t("sections.products.description")}
      >
        <Stack gap={3}>
          <AdminSingleProductField
            name="featuredProductId"
            label={t("fields.featuredProduct")}
            placeholder={t("fields.featuredProduct")}
            helperText={t("helpers.featuredProduct")}
            locale={locale}
            initialOption={data.featuredProductOption}
            initialOptions={data.initialProductOptions}
          />
          <AdminSingleProductField
            name="newBookProductId"
            label={t("fields.newBookProduct")}
            placeholder={t("fields.newBookProduct")}
            helperText={t("helpers.newBookProduct")}
            locale={locale}
            initialOption={data.newBookProductOption}
            initialOptions={data.initialProductOptions}
          />

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <AdminConfirmSubmitButton label={t("buttons.save")} />
          </Box>
        </Stack>
      </AdminSectionCard>
    </form>
  );
};

export type { AdminHeroEditorProps } from "./types";
