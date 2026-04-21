import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Button, Paper, Stack, Typography } from "@mui/material";

import { getAdminCategoryLabel, getAdminProductTypeLabel } from "@/utils/admin";

import { AdminPageHero, AdminStatusChip } from "../../admin-page-shared";
import type { AdminProductFormHeroProps } from "./types";

export const AdminProductFormHero = ({
  title,
  description,
  submitLabel,
  isNew,
  locale,
  dictionary,
  sharedDictionary,
  categories,
  selectedType,
  selectedCategory,
  isActive,
  totalImages,
  totalAssets,
}: AdminProductFormHeroProps) => {
  const categoryLabel =
    getAdminCategoryLabel(
      categories.find((category) => category.key === selectedCategory)?.translations ??
        {},
      locale,
    ) || selectedCategory;

  return (
    <AdminPageHero
      eyebrow={isNew ? dictionary.newEyebrow : dictionary.editEyebrow}
      title={title}
      description={description}
      actions={
        <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
          <Button
            href="/admin/products"
            variant="outlined"
            color="inherit"
            sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
          >
            {sharedDictionary.actions.backToProducts}
          </Button>
          <Button
            type="submit"
            form="admin-product-form"
            variant="contained"
            startIcon={<SaveOutlinedIcon />}
          >
            {submitLabel}
          </Button>
        </Stack>
      }
      aside={
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: "24px",
            bgcolor: "#fff",
            border: "1px solid #F0DFC8",
            minWidth: { xl: 280 },
          }}
        >
          <Stack gap={1.5}>
            <Typography color="text.secondary" variant="body2">
              {dictionary.summaryTitle}
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <AdminStatusChip
                label={getAdminProductTypeLabel(
                  selectedType,
                  sharedDictionary.status.productTypes,
                )}
                tone="info"
              />
              <AdminStatusChip label={categoryLabel} tone="accent" />
              <AdminStatusChip
                label={
                  isActive
                    ? sharedDictionary.status.active
                    : sharedDictionary.status.hidden
                }
                tone={isActive ? "success" : "neutral"}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {dictionary.summaryGalleryAssets}: {totalImages}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dictionary.summaryDigitalFiles}: {totalAssets}
            </Typography>
          </Stack>
        </Paper>
      }
    />
  );
};

export type { AdminProductFormHeroProps } from "./types";