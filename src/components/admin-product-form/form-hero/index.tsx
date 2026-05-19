import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Button, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { DeleteProductButton } from "@/components/admin-products-page-view/delete-product-button";

import { getAdminCategoryLabel, getAdminProductTypeLabel } from "@/utils/admin";

import {
  AdminConfirmSubmitButton,
  AdminPageHero,
  AdminStatusChip,
} from "../../admin-page-shared";
import type { AdminProductFormHeroProps } from "./types";

export const AdminProductFormHero = ({
  productId,
  deleteAction,
  isNew,
  locale,
  categories,
  selectedType,
  selectedCategory,
  isActive,
  totalImages,
  totalAssets,
  isSubmitting = false,
}: AdminProductFormHeroProps) => {
  const categoryLabel =
    getAdminCategoryLabel(
      categories.find((category) => category.key === selectedCategory)?.translations ??
        {},
      locale,
    ) || selectedCategory;
  const tForm = useTranslations("adminPage.productForm");
  const tShared = useTranslations("adminPage.shared");
  const productTypeLabels = {
    book: tShared("status.productTypes.book"),
    merch: tShared("status.productTypes.merch"),
  };
  const title = isNew ? tForm("newTitle") : `${tForm("editTitlePrefix")}: ${productId}`;
  const description = isNew ? tForm("newDescription") : tForm("editDescription");
  const submitLabel = isNew ? tForm("createButton") : tForm("saveChangesButton");
  const pendingSubmitLabel = isNew
    ? tForm("creatingButton")
    : tForm("savingChangesButton");

  return (
    <AdminPageHero
      eyebrow={isNew ? tForm("newEyebrow") : tForm("editEyebrow")}
      title={title}
      description={description}
      actions={
        <Stack direction={{ xs: "column", sm: "row" }} gap={1.5}>
          <Tooltip title={tShared("actions.backToProducts")}>
            <Button
              href="/admin/products"
              variant="outlined"
              color="inherit"
              sx={{ borderColor: "#E8D6BF", bgcolor: "#fff" }}
            >
              {tShared("actions.backToProducts")}
            </Button>
          </Tooltip>
          {!isNew && productId && deleteAction ? (
            <DeleteProductButton
              productId={productId}
              action={deleteAction}
            />
          ) : null}
          <Tooltip title={isSubmitting ? pendingSubmitLabel ?? submitLabel : submitLabel}>
            <span>
              <AdminConfirmSubmitButton
                form="admin-product-form"
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                label={submitLabel}
                pendingLabel={pendingSubmitLabel}
                pending={isSubmitting}
              />
            </span>
          </Tooltip>
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
              {tForm("summaryTitle")}
            </Typography>
            <Stack direction="row" gap={1} flexWrap="wrap">
              <AdminStatusChip
                label={getAdminProductTypeLabel(selectedType, productTypeLabels)}
                tone="info"
              />
              <AdminStatusChip label={categoryLabel} tone="accent" />
              <AdminStatusChip
                label={
                  isActive
                    ? tShared("status.active")
                    : tShared("status.hidden")
                }
                tone={isActive ? "success" : "neutral"}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {tForm("summaryGalleryAssets")}: {totalImages}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tForm("summaryDigitalFiles")}: {totalAssets}
            </Typography>
          </Stack>
        </Paper>
      }
    />
  );
};

export type { AdminProductFormHeroProps } from "./types";