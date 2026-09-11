"use client";

import { Box, Checkbox, MenuItem, Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import { ENTERTAINMENT_CATEGORIES } from "@/constants/entertainment";
import type { EntertainmentCategoryKey } from "@/types/entertainment";

import {
  AdminCheckboxField,
  AdminSectionCard,
} from "../../../admin-page-shared";
import type { AdminEntertainmentBaseSectionProps } from "./types";

const fieldsGridSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
  gap: 2,
} as const;

export const AdminEntertainmentBaseSection = ({
  item,
  isNew,
  selectedCategory,
  onCategoryChangeAction,
}: AdminEntertainmentBaseSectionProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const tCategories = useTranslations("storefront.entertainmentCategories");

  return (
    <AdminSectionCard
      title={tForm("baseSectionTitle")}
      description={tForm("baseSectionDescription")}
    >
      <Stack gap={2.5}>
        <Box sx={fieldsGridSx}>
          <TextField
            select
            label={tForm("fields.category")}
            name="category"
            value={selectedCategory}
            onChange={(event) =>
              onCategoryChangeAction(
                event.target.value as EntertainmentCategoryKey,
              )
            }
            helperText={tForm("helpers.category")}
          >
            {ENTERTAINMENT_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {tCategories(category)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label={tForm("fields.sortOrder")}
            name="sortOrder"
            type="number"
            defaultValue={item.sortOrder}
            helperText={tForm("helpers.sortOrder")}
          />

          <TextField
            label={tForm("fields.slug")}
            name="slug"
            defaultValue={item.slug}
            helperText={
              isNew ? tForm("helpers.newSlug") : tForm("helpers.slug")
            }
          />
        </Box>

        <Stack direction="row" gap={3} flexWrap="wrap">
          <AdminCheckboxField
            control={
              <Checkbox name="isActive" defaultChecked={item.status.isActive} />
            }
            label={tForm("fields.isActive")}
          />
          <AdminCheckboxField
            control={
              <Checkbox
                name="visibleOnHome"
                defaultChecked={item.status.visibleOnHome}
              />
            }
            label={tForm("fields.visibleOnHome")}
          />
        </Stack>
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminEntertainmentBaseSectionProps } from "./types";
