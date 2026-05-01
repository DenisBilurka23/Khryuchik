"use client";

import { useState } from "react";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Alert, Box, Paper, Stack, Typography } from "@mui/material";

import type { ProductType } from "@/types/catalog";

import { AdminConfirmSubmitButton } from "../../admin-page-shared";
import { AdminProductFormHero } from "../form-hero";
import {
  AdminProductBaseSection,
  AdminProductLocaleSection,
  AdminProductPricingSection,
  AdminProductRelatedSection,
  AdminProductReviewsSection,
} from "../sections";
import type { AdminProductFormProps } from "../types";

const booksCategoryKey = "books";

export const AdminProductForm = ({
  title,
  description,
  submitLabel,
  pendingSubmitLabel,
  locale,
  dictionary,
  sharedDictionary,
  payload,
  categories,
  initialRelatedProductOptions,
  selectedRelatedProductOptions,
  selectedStoryProductOption,
  action,
  deleteAction,
  deleteDialogTitle,
  deleteDialogDescription,
  confirmDeleteLabel,
  cancelDeleteLabel,
  isNew,
  errorMessage,
}: AdminProductFormProps) => {
  const ruDetails = payload.details.translations.ru;
  const enDetails = payload.details.translations.en;
  const sharedReviews =
    ruDetails.reviews.length > 0 ? ruDetails.reviews : enDetails.reviews;
  const totalImages = ruDetails.images.length + enDetails.images.length;
  const totalAssets =
    (ruDetails.digitalAssets?.length ?? 0) +
    (enDetails.digitalAssets?.length ?? 0);
  const merchCategories = categories.filter(
    (category) => category.key !== booksCategoryKey,
  );
  const firstMerchCategoryKey = merchCategories[0]?.key ?? "";
  const [selectedType, setSelectedType] = useState(
    payload.product.classification.type,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    payload.product.classification.type === "book"
      ? booksCategoryKey
      : payload.product.classification.category,
  );

  const effectiveCategory =
    selectedType === "book" ? booksCategoryKey : selectedCategory;

  const handleTypeChange = (nextType: ProductType) => {
    setSelectedType(nextType);

    if (nextType === "book") {
      setSelectedCategory(booksCategoryKey);
      return;
    }

    setSelectedCategory((currentCategory) =>
      currentCategory && currentCategory !== booksCategoryKey
        ? currentCategory
        : firstMerchCategoryKey,
    );
  };

  return (
    <Stack gap={3}>
      <AdminProductFormHero
        title={title}
        description={description}
        submitLabel={submitLabel}
        pendingSubmitLabel={pendingSubmitLabel}
        deleteLabel={dictionary.deleteButton}
        productId={payload.product.productId}
        deleteAction={deleteAction}
        deleteDialogTitle={deleteDialogTitle}
        deleteDialogDescription={deleteDialogDescription}
        confirmDeleteLabel={confirmDeleteLabel}
        cancelDeleteLabel={cancelDeleteLabel}
        isNew={isNew}
        locale={locale}
        dictionary={dictionary}
        sharedDictionary={sharedDictionary}
        categories={categories}
        selectedType={selectedType}
        selectedCategory={effectiveCategory}
        isActive={payload.product.status.isActive}
        totalImages={totalImages}
        totalAssets={totalAssets}
        isSubmitting={isSubmitting}
      />

      <form id="admin-product-form" action={action} onSubmit={() => setIsSubmitting(true)}>
        <input type="hidden" name="formMode" value={isNew ? "new" : "edit"} />
        <Stack gap={3}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <AdminProductBaseSection
            dictionary={dictionary}
            sharedDictionary={sharedDictionary}
            payload={payload}
            categories={categories}
            locale={locale}
            isNew={isNew}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            merchCategories={merchCategories}
            onTypeChange={handleTypeChange}
            onCategoryChange={setSelectedCategory}
          />

          <AdminProductPricingSection dictionary={dictionary} payload={payload} />

          {(["ru", "en"] as const).map((translationLocale) => (
            <AdminProductLocaleSection
              key={translationLocale}
              locale={translationLocale}
              dictionary={dictionary}
              translation={payload.product.translations[translationLocale]}
              details={payload.details.translations[translationLocale]}
            />
          ))}

          <AdminProductReviewsSection
            dictionary={dictionary}
            initialReviews={sharedReviews}
          />

          <AdminProductRelatedSection
            locale={locale}
            dictionary={dictionary}
            payload={payload}
            initialProductOptions={initialRelatedProductOptions}
            selectedProductOptions={selectedRelatedProductOptions}
            selectedStoryProductOption={selectedStoryProductOption}
          />

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.75 },
              borderRadius: "28px",
              bgcolor: "#FFFFFF",
              border: "1px solid #F0DFC8",
              boxShadow: "0 18px 50px rgba(215, 167, 118, 0.12)",
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              gap={{ xs: 2, md: 3 }}
              alignItems={{ xs: "stretch", md: "center" }}
              justifyContent="space-between"
            >
              <Stack direction="row" gap={2} alignItems="center">
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "20px",
                    color: "#D96583",
                    bgcolor: "#FCE7EF",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
                  }}
                >
                  <AutoAwesomeRoundedIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ mb: 0.5 }}>
                    {dictionary.footerTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dictionary.footerDescription}
                  </Typography>
                </Box>
              </Stack>

              <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "stretch", md: "flex-end" },
                width: { xs: "100%", md: "auto" },
              }}
            >
              <AdminConfirmSubmitButton
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                label={submitLabel}
                pendingLabel={pendingSubmitLabel}
                sx={{
                  width: { xs: "100%", md: "auto" },
                  minWidth: { md: 256 },
                  minHeight: 56,
                  px: { md: 4 },
                  borderRadius: "20px",
                }}
              />
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </form>
    </Stack>
  );
};

export type { AdminProductFormProps } from "../types";