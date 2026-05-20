import { Box, Stack, TextField } from "@mui/material";
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
  translation,
  details,
  productId,
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
      title={`${locale.toUpperCase()} ${tForm("localeSectionTitle")}`}
      description={tForm("localeSectionDescription")}
      action={
        <Stack direction="row" gap={1} flexWrap="wrap">
          <AdminStatusChip
            label={`${details.images.length} ${tForm("galleryCountLabel")}`}
            tone="info"
          />
          <AdminStatusChip
            label={`${details.digitalAssets?.length ?? 0} ${tForm("filesCountLabel")}`}
            tone="warning"
          />
        </Stack>
      }
    >
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
            required
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
            required
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
            required
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
            name={`${locale}.languagesJson`}
            title={tForm("fields.languages")}
            helperText={tForm("helpers.optionsRule")}
            initialOptions={details.languages ?? []}
            itemLabel={tForm("fields.languages")}
          />
          <AdminOptionsField
            name={`${locale}.formatsJson`}
            title={tForm("fields.formats")}
            helperText={tForm("helpers.optionsRule")}
            initialOptions={details.formats ?? []}
            itemLabel={tForm("fields.formats")}
          />
          <AdminOptionsField
            name={`${locale}.sizesJson`}
            title={tForm("fields.sizes")}
            helperText={tForm("helpers.optionsRule")}
            initialOptions={details.sizes ?? []}
            itemLabel={tForm("fields.sizes")}
          />
          <AdminOptionsField
            name={`${locale}.colorsJson`}
            title={tForm("fields.colors")}
            helperText={tForm("helpers.optionsRule")}
            initialOptions={details.colors ?? []}
            itemLabel={tForm("fields.colors")}
          />
        </Box>

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
    </AdminSectionCard>
  );
};

export type { AdminProductLocaleSectionProps } from "./types";