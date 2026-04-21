"use client";

import { useState } from "react";

import { Alert, Stack } from "@mui/material";

import type { ProductType } from "@/types/catalog";

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
  locale,
  dictionary,
  sharedDictionary,
  payload,
  categories,
  action,
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
      />

      <form id="admin-product-form" action={action}>
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
            dictionary={dictionary}
            submitLabel={submitLabel}
            payload={payload}
          />
        </Stack>
      </form>
    </Stack>
  );
};

export type { AdminProductFormProps } from "../types";