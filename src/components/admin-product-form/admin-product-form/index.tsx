"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Alert, Box, Paper, Stack, Typography } from "@mui/material";

import { BOOKS_CATEGORY_KEY } from "@/constants/catalog";
import { defaultLocale } from "@/i18n/config";
import { useProductPublishToggles } from "@/hooks/useProductPublishToggles";
import { AdminProductFormErrorCode } from "@/server/admin/product-form-state";
import type { ProductType } from "@/types/catalog";
import { getLocaleDisplayName } from "@/utils";

import { AdminConfirmSubmitButton, AdminSectionCard } from "../../admin-page-shared";
import { AdminReviewsField } from "../reviews-field";
import { AdminProductFormHero } from "../form-hero";
import {
  AdminProductBaseSection,
  AdminProductLocaleSection,
  AdminProductPricingSection,
  AdminProductPrintifySection,
  AdminProductRelatedSection,
} from "../sections";
import {
  AdminProductUploadRegistryProvider,
  useAdminProductUploadRegistry,
} from "../upload-registry";
import type { AdminProductFormProps } from "../types";

const AdminProductFormInner = ({
  locale,
  payload,
  categories,
  activeLocales,
  activeRegions,
  initialRelatedProductOptions,
  selectedRelatedProductOptions,
  selectedStoryProductOption,
  action,
  deleteAction,
  syncPrintifyAction,
  relinkPrintifyAction,
  isNew,
  errorCode,
}: AdminProductFormProps) => {
  const tForm = useTranslations("adminPage.productForm");
  const { runAll } = useAdminProductUploadRegistry();
  const {
    toggleLocale,
    toggleRegion,
    isLocaleActive,
    isRegionActive,
  } = useProductPublishToggles({
    payload,
    localeCodes: activeLocales.map((item) => item.code),
    regionCodes: activeRegions.map((item) => item.code),
    defaultLocale,
    isNew,
  });
  const formRef = useRef<HTMLFormElement | null>(null);
  const [uploadErrorMessage, setUploadErrorMessage] = useState<string | null>(
    null,
  );
  const submitLabel = isNew
    ? tForm("createButton")
    : tForm("saveChangesButton");
  const pendingSubmitLabel = isNew
    ? tForm("creatingButton")
    : tForm("savingChangesButton");
  const errorMessage = (() => {
    if (uploadErrorMessage) {
      return uploadErrorMessage;
    }

    switch (errorCode) {
      case AdminProductFormErrorCode.StorageUnavailable:
        return tForm("errorMessages.storageUnavailable");
      case AdminProductFormErrorCode.SaveFailed:
        return tForm("errorMessages.saveFailed");
      case AdminProductFormErrorCode.DeleteFailed:
        return tForm("errorMessages.deleteFailed");
      case AdminProductFormErrorCode.Unexpected:
        return tForm("errorMessages.unexpected");
      default:
        return undefined;
    }
  })();
  const localeDetails = activeLocales.map(
    (activeLocale) => payload.details.translations[activeLocale.code],
  );
  const sharedReviews =
    localeDetails.find((details) => details.reviews.length > 0)?.reviews ?? [];
  const totalImages = localeDetails.reduce(
    (total, details) => total + details.images.length,
    0,
  );
  const totalAssets = localeDetails.reduce(
    (total, details) => total + (details.digitalAssets?.length ?? 0),
    0,
  );
  const merchCategories = categories.filter(
    (category) => category.key !== BOOKS_CATEGORY_KEY,
  );
  const firstMerchCategoryKey = merchCategories[0]?.key ?? "";
  const [selectedType, setSelectedType] = useState(
    payload.product.classification.type,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    payload.product.classification.type === "book"
      ? BOOKS_CATEGORY_KEY
      : payload.product.classification.category,
  );

  const effectiveCategory =
    selectedType === "book" ? BOOKS_CATEGORY_KEY : selectedCategory;

  const handleTypeChange = (nextType: ProductType) => {
    setSelectedType(nextType);

    if (nextType === "book") {
      setSelectedCategory(BOOKS_CATEGORY_KEY);
      return;
    }

    setSelectedCategory((currentCategory) =>
      currentCategory && currentCategory !== BOOKS_CATEGORY_KEY
        ? currentCategory
        : firstMerchCategoryKey,
    );
  };

  const formAction = async (formData: FormData) => {
    setUploadErrorMessage(null);

    try {
      await runAll();
    } catch (uploadError) {
      console.error("Admin product upload failed", uploadError);
      setIsSubmitting(false);
      setUploadErrorMessage(tForm("errorMessages.uploadFailed"));
      return;
    }

    const finalFormData = formRef.current
      ? new FormData(formRef.current)
      : formData;

    await action(finalFormData);
  };

  return (
    <Stack gap={3}>
      <AdminProductFormHero
        productId={payload.product.productId}
        deleteAction={deleteAction}
        isNew={isNew}
        locale={locale}
        categories={categories}
        selectedType={selectedType}
        selectedCategory={effectiveCategory}
        isActive={payload.product.status.isActive}
        totalImages={totalImages}
        totalAssets={totalAssets}
        isSubmitting={isSubmitting}
      />

      <form
        id="admin-product-form"
        ref={formRef}
        action={formAction}
        onSubmit={() => setIsSubmitting(true)}
      >
        <input type="hidden" name="formMode" value={isNew ? "new" : "edit"} />
        <input
          type="hidden"
          name="localeCodes"
          value={activeLocales.map((item) => item.code).join(",")}
        />
        <input
          type="hidden"
          name="regionCodes"
          value={activeRegions.map((item) => item.code).join(",")}
        />
        <Stack gap={3}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

          <AdminProductBaseSection
            payload={payload}
            categories={categories}
            locale={locale}
            isNew={isNew}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
            merchCategories={merchCategories}
            onTypeChange={handleTypeChange}
            onCategoryChange={setSelectedCategory}
            availableLocales={activeLocales}
            availableRegions={activeRegions}
            initialLanguages={payload.details.translations[defaultLocale]?.languages ?? []}
            initialFormats={payload.details.translations[defaultLocale]?.formats ?? []}
          />

          <AdminProductPricingSection
            payload={payload}
            regions={activeRegions}
            isRegionActive={isRegionActive}
            onToggleRegion={toggleRegion}
          />

          {payload.product.printify ? (
            <AdminProductPrintifySection
              productId={payload.product.productId}
              locale={locale}
              link={payload.product.printify}
              syncAction={syncPrintifyAction}
              relinkAction={relinkPrintifyAction}
            />
          ) : null}

          {activeLocales.map((activeLocale) => (
            <AdminProductLocaleSection
              key={activeLocale.code}
              locale={activeLocale.code}
              label={getLocaleDisplayName(activeLocale.code, locale)}
              isActive={isLocaleActive(activeLocale.code)}
              canToggle={activeLocale.code !== defaultLocale}
              onToggleActive={() => toggleLocale(activeLocale.code)}
              translation={payload.product.translations[activeLocale.code]}
              details={payload.details.translations[activeLocale.code]}
              productId={isNew ? undefined : payload.product.productId}
              selectedType={selectedType}
              availableRegions={activeRegions}
            />
          ))}

          <AdminSectionCard title={tForm("reviewsSectionTitle")}>
            <AdminReviewsField
              name="reviewsJson"
              initialReviews={sharedReviews}
              authorLabel={tForm("fields.reviewAuthor")}
              reviewLabel={tForm("fields.reviewText")}
              ratingLabel={tForm("fields.reviewRating")}
              dateLabel={tForm("fields.reviewDate")}
              addButtonLabel={tForm("buttons.addReview")}
              removeButtonLabel={tForm("buttons.removeItem")}
            />
          </AdminSectionCard>

          <AdminProductRelatedSection
            locale={locale}
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
                    {tForm("footerTitle")}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tForm("footerDescription")}
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

export const AdminProductForm = (props: AdminProductFormProps) => (
  <AdminProductUploadRegistryProvider>
    <AdminProductFormInner {...props} />
  </AdminProductUploadRegistryProvider>
);

export type { AdminProductFormProps } from "../types";