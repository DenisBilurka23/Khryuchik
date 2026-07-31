"use client";

import {
  Box,
  Collapse,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminSectionCard, AdminStatusChip } from "../../../admin-page-shared";
import { AdminFileUploadField } from "../../file-upload-field";
import { AdminImageUploadField } from "../../image-upload-field";
import { AdminOptionsField } from "../../options-field";
import { AdminSpecsField } from "../../specs-field";
import type { AdminProductLocaleSectionProps } from "./types";

const stringifyLines = (value: string[] | undefined) =>
  (value ?? []).join("\n");

export const AdminProductLocaleSection = ({
  locale,
  label,
  isActive,
  canToggle,
  onToggleActiveAction,
  translation,
  details,
  productId,
  selectedType,
  availableRegions,
}: AdminProductLocaleSectionProps) => {
  const tForm = useTranslations("adminPage.productForm");
  const uploadStatusLabels = {
    pending: tForm("uploadStatus.pending"),
    uploading: tForm("uploadStatus.uploading"),
    uploaded: tForm("uploadStatus.uploaded"),
    error: tForm("uploadStatus.error"),
  };

  return (
    <AdminSectionCard
      title={`${label} ${tForm("localeSectionTitle")}`}
      description={tForm("localeSectionDescription")}
      action={
        <Stack direction="row" gap={1.5} flexWrap="wrap" alignItems="center">
          {isActive ? (
            <>
              <AdminStatusChip
                label={`${details.images.length} ${tForm("galleryCountLabel")}`}
                tone="info"
              />
              <AdminStatusChip
                label={`${details.digitalAssets?.length ?? 0} ${tForm("filesCountLabel")}`}
                tone="warning"
              />
            </>
          ) : null}
          <FormControlLabel
            sx={{ mr: 0 }}
            control={
              <Switch
                checked={isActive}
                onChange={onToggleActiveAction}
                disabled={!canToggle}
              />
            }
            label={tForm("addForLanguage")}
          />
        </Stack>
      }
    >
      <input
        type="hidden"
        name={`${locale}.active`}
        value={isActive ? "on" : "off"}
      />
      <Collapse in={isActive}>
        <Stack gap={2.5}>
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
          <input type="hidden" name={`${locale}.emoji`} value={translation.emoji} />
          <input
            type="hidden"
            name={`${locale}.lang`}
            value={translation.lang ?? locale.toUpperCase()}
          />
          <input
            type="hidden"
            name={`${locale}.detailOldPrice`}
            value={details.oldPrice ?? ""}
          />
          <TextField
            label={tForm("fields.title")}
            name={`${locale}.title`}
            defaultValue={translation.title}
            required={isActive}
          />
          <TextField
            label={tForm("fields.shortTitle")}
            name={`${locale}.shortTitle`}
            defaultValue={translation.shortTitle ?? ""}
          />
          <TextField
            label={tForm("fields.shortDescription")}
            name={`${locale}.shortDescription`}
            defaultValue={translation.shortDescription}
            required={isActive}
          />
          <TextField
            label={tForm("fields.thumbnailBackgroundColor")}
            name={`${locale}.thumbnailBackgroundColor`}
            defaultValue={translation.thumbnailBackgroundColor ?? ""}
          />
          <TextField
            label={tForm("fields.subtitle")}
            name={`${locale}.subtitle`}
            defaultValue={details.subtitle}
            required={isActive}
          />
          <TextField
            label={tForm("fields.badge")}
            name={`${locale}.badge`}
            defaultValue={details.badge ?? ""}
          />
          <TextField
            label={tForm("fields.storyLabel")}
            name={`${locale}.storyLabel`}
            defaultValue={details.storyLabel ?? ""}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
            mt: 0.5,
          }}
        >
          <TextField
            label={tForm("fields.description")}
            name={`${locale}.description`}
            defaultValue={details.description}
            multiline
            minRows={6}
            fullWidth
          />
          <TextField
            label={tForm("fields.deliveryLines")}
            name={`${locale}.deliveryLines`}
            defaultValue={stringifyLines(details.delivery)}
            multiline
            minRows={6}
            fullWidth
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
            },
            gap: 2,
            alignItems: "start",
          }}
        >
          <AdminImageUploadField
            imagesJsonInputName={`${locale}.imagesJson`}
            locale={locale}
            productId={productId}
            buttonLabel={`${tForm("imagesUploadButton")} ${locale.toUpperCase()}`}
            helperText={tForm("helpers.mediaRule")}
            removeButtonLabel={tForm("buttons.removeItem")}
            thumbnailLabel={tForm("fields.thumbnail")}
            galleryLabel={tForm("fields.gallery")}
            existingImages={details.images}
            statusLabels={uploadStatusLabels}
          />

          <AdminFileUploadField
            assetsJsonInputName={`${locale}.digitalAssetsJson`}
            locale={locale}
            productId={productId}
            buttonLabel={`${tForm("assetsUploadButton")} ${locale.toUpperCase()}`}
            helperText={tForm("helpers.filesRule")}
            existingFiles={details.digitalAssets ?? []}
            statusLabels={uploadStatusLabels}
          />
        </Box>

        {selectedType === "merch" && (
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
            <AdminOptionsField
              name={`${locale}.sizesJson`}
              title={tForm("fields.sizes")}
              helperText={tForm("helpers.optionsRule")}
              priceDeltaHelperText={tForm("helpers.optionPriceDeltaRule")}
              initialOptions={details.sizes ?? []}
              itemLabel={tForm("fields.sizes")}
              regions={availableRegions}
            />
            <AdminOptionsField
              name={`${locale}.colorsJson`}
              title={tForm("fields.colors")}
              helperText={tForm("helpers.optionsRule")}
              priceDeltaHelperText={tForm("helpers.optionPriceDeltaRule")}
              initialOptions={details.colors ?? []}
              itemLabel={tForm("fields.colors")}
              regions={availableRegions}
            />
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 2,
          }}
        >
          <AdminSpecsField
            name={`${locale}.specsJson`}
            title={tForm("fields.specs")}
            helperText={tForm("helpers.specsRule")}
            initialSpecs={details.specs}
            labelTitle={tForm("fields.specLabel")}
            valueTitle={tForm("fields.specValue")}
            addButtonLabel={tForm("buttons.addSpec")}
            removeButtonLabel={tForm("buttons.removeItem")}
          />
        </Box>
        </Stack>
      </Collapse>
    </AdminSectionCard>
  );
};

export type { AdminProductLocaleSectionProps } from "./types";