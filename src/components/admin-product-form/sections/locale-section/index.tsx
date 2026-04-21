import { Box, Stack, TextField } from "@mui/material";

import { AdminSectionCard, AdminStatusChip } from "../../../admin-page-shared";
import { AdminFileUploadField } from "../../file-upload-field";
import { AdminImageUploadField } from "../../image-upload-field";
import { AdminOptionsField } from "../../options-field";
import { AdminSpecsField } from "../../specs-field";
import type { AdminProductLocaleSectionProps } from "./types";

const stringifyJson = (value: unknown) => JSON.stringify(value ?? [], null, 2);

const stringifyLines = (value: string[] | undefined) =>
  (value ?? []).join("\n");

export const AdminProductLocaleSection = ({
  locale,
  dictionary,
  translation,
  details,
}: AdminProductLocaleSectionProps) => {
  return (
    <AdminSectionCard
      title={`${locale.toUpperCase()} ${dictionary.localeSectionTitle}`}
      description={dictionary.localeSectionDescription}
      action={
        <Stack direction="row" gap={1} flexWrap="wrap">
          <AdminStatusChip
            label={`${details.images.length} ${dictionary.galleryCountLabel}`}
            tone="info"
          />
          <AdminStatusChip
            label={`${details.digitalAssets?.length ?? 0} ${dictionary.filesCountLabel}`}
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
          <input
            type="hidden"
            name={`${locale}.imagesJson`}
            value={stringifyJson(details.images)}
          />
          <input
            type="hidden"
            name={`${locale}.digitalAssetsJson`}
            value={stringifyJson(details.digitalAssets)}
          />
          <TextField
            label={dictionary.fields.title}
            name={`${locale}.title`}
            defaultValue={translation.title}
            required
          />
          <TextField
            label={dictionary.fields.shortTitle}
            name={`${locale}.shortTitle`}
            defaultValue={translation.shortTitle ?? ""}
          />
          <TextField
            label={dictionary.fields.shortDescription}
            name={`${locale}.shortDescription`}
            defaultValue={translation.shortDescription}
            required
          />
          <TextField
            label={dictionary.fields.thumbnailBackgroundColor}
            name={`${locale}.thumbnailBackgroundColor`}
            defaultValue={translation.thumbnailBackgroundColor ?? ""}
          />
          <TextField
            label={dictionary.fields.subtitle}
            name={`${locale}.subtitle`}
            defaultValue={details.subtitle}
            required
          />
          <TextField
            label={dictionary.fields.badge}
            name={`${locale}.badge`}
            defaultValue={details.badge ?? ""}
          />
          <TextField
            label={dictionary.fields.storyLabel}
            name={`${locale}.storyLabel`}
            defaultValue={details.storyLabel ?? ""}
          />
          <TextField
            label={dictionary.fields.storyTitle}
            name={`${locale}.storyTitle`}
            defaultValue={details.storyTitle ?? ""}
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
            label={dictionary.fields.description}
            name={`${locale}.description`}
            defaultValue={details.description}
            multiline
            minRows={6}
            fullWidth
          />
          <TextField
            label={dictionary.fields.deliveryLines}
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
            name={`gallery${locale.toUpperCase()}`}
            buttonLabel={`${dictionary.imagesUploadButton} ${locale.toUpperCase()}`}
            helperText={dictionary.helpers.mediaRule}
            thumbnailLabel={dictionary.fields.thumbnail}
            galleryLabel={dictionary.fields.gallery}
            existingImages={details.images}
          />

          <AdminFileUploadField
            name={`digitalAssets${locale.toUpperCase()}`}
            buttonLabel={`${dictionary.assetsUploadButton} ${locale.toUpperCase()}`}
            helperText={dictionary.helpers.filesRule}
            existingFiles={details.digitalAssets ?? []}
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
            title={dictionary.fields.languages}
            helperText={dictionary.helpers.optionsRule}
            initialOptions={details.languages ?? []}
            itemLabel={dictionary.fields.languages}
          />
          <AdminOptionsField
            name={`${locale}.formatsJson`}
            title={dictionary.fields.formats}
            helperText={dictionary.helpers.optionsRule}
            initialOptions={details.formats ?? []}
            itemLabel={dictionary.fields.formats}
          />
          <AdminOptionsField
            name={`${locale}.sizesJson`}
            title={dictionary.fields.sizes}
            helperText={dictionary.helpers.optionsRule}
            initialOptions={details.sizes ?? []}
            itemLabel={dictionary.fields.sizes}
          />
          <AdminOptionsField
            name={`${locale}.colorsJson`}
            title={dictionary.fields.colors}
            helperText={dictionary.helpers.optionsRule}
            initialOptions={details.colors ?? []}
            itemLabel={dictionary.fields.colors}
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
            title={dictionary.fields.specs}
            helperText={dictionary.helpers.specsRule}
            initialSpecs={details.specs}
            labelTitle={dictionary.fields.specLabel}
            valueTitle={dictionary.fields.specValue}
            addButtonLabel={dictionary.buttons.addSpec}
            removeButtonLabel={dictionary.buttons.removeItem}
          />
        </Box>
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminProductLocaleSectionProps } from "./types";