import {
  Alert,
  Box,
  Button,
  Checkbox,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { getAdminCategoryLabel, getAdminProductTypeLabel } from "@/utils/admin";

import {
  AdminCheckboxField,
  AdminPageHero,
  AdminSectionCard,
  AdminStatusChip,
} from "../admin-page-shared";
import { AdminFileUploadField } from "./file-upload-field";
import { AdminImageUploadField } from "./image-upload-field";
import type { AdminProductFormProps } from "./types";

const stringifyJson = (value: unknown) => JSON.stringify(value ?? [], null, 2);

const stringifyLines = (value: string[] | undefined) =>
  (value ?? []).join("\n");

const stringifyOptionLines = (value: { label: string; value: string }[] | undefined) =>
  (value ?? []).map((item) => `${item.label} | ${item.value}`).join("\n");

const stringifySpecsLines = (value: Array<{ label: string; value: string }> | undefined) =>
  (value ?? []).map((item) => `${item.label} | ${item.value}`).join("\n");

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
  const totalImages = ruDetails.images.length + enDetails.images.length;
  const totalAssets =
    (ruDetails.digitalAssets?.length ?? 0) +
    (enDetails.digitalAssets?.length ?? 0);

  return (
    <Stack gap={3}>
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
                    payload.product.classification.type,
                    sharedDictionary.status.productTypes,
                  )}
                  tone="info"
                />
                <AdminStatusChip
                  label={
                    getAdminCategoryLabel(
                      categories.find(
                        (category) =>
                          category.key ===
                          payload.product.classification.category,
                      )?.translations ?? {},
                      locale,
                    ) || payload.product.classification.category
                  }
                  tone="accent"
                />
                <AdminStatusChip
                  label={
                    payload.product.status.isActive
                      ? sharedDictionary.status.active
                      : sharedDictionary.status.hidden
                  }
                  tone={payload.product.status.isActive ? "success" : "neutral"}
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

      <form id="admin-product-form" action={action}>
        <input type="hidden" name="formMode" value={isNew ? "new" : "edit"} />
        <Stack gap={3}>
          {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
          <Alert severity="info">{dictionary.infoAlert}</Alert>

          <AdminSectionCard
            title={dictionary.baseSectionTitle}
            description={dictionary.baseSectionDescription}
          >
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
              <TextField
                label={dictionary.fields.productId}
                name="productId"
                defaultValue={payload.product.productId}
                required
                slotProps={{ input: { readOnly: !isNew } }}
              />
              <TextField
                select
                label={dictionary.fields.type}
                name="type"
                defaultValue={payload.product.classification.type}
              >
                <MenuItem value="book">
                  {sharedDictionary.status.productTypes.book}
                </MenuItem>
                <MenuItem value="merch">
                  {sharedDictionary.status.productTypes.merch}
                </MenuItem>
              </TextField>
              <TextField
                select
                label={dictionary.fields.category}
                name="category"
                defaultValue={payload.product.classification.category}
              >
                {categories.map((category) => (
                  <MenuItem key={category.key} value={category.key}>
                    {getAdminCategoryLabel(category.translations, locale) ||
                      category.key}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={dictionary.fields.sortOrder}
                name="sortOrder"
                type="number"
                defaultValue={payload.product.merchandising.sortOrder}
              />
              <TextField
                select
                label={dictionary.fields.availability}
                name="availability"
                defaultValue={payload.product.inventory.availability}
              >
                <MenuItem value="in_stock">
                  {sharedDictionary.status.availability.in_stock}
                </MenuItem>
                <MenuItem value="out_of_stock">
                  {sharedDictionary.status.availability.out_of_stock}
                </MenuItem>
                <MenuItem value="preorder">
                  {sharedDictionary.status.availability.preorder}
                </MenuItem>
                <MenuItem value="made_to_order">
                  {sharedDictionary.status.availability.made_to_order}
                </MenuItem>
              </TextField>
              <TextField
                label={dictionary.fields.quantity}
                name="quantity"
                type="number"
                defaultValue={payload.product.inventory.quantity ?? ""}
              />
              <TextField
                label={dictionary.fields.placements}
                name="placements"
                defaultValue={payload.product.merchandising.placements.join(
                  ", ",
                )}
                helperText={dictionary.helpers.placements}
              />
              <TextField
                label={dictionary.fields.flags}
                name="flags"
                defaultValue={payload.product.merchandising.flags.join(", ")}
                helperText={dictionary.helpers.flags}
              />
            </Box>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, minmax(0, 1fr))",
                },
                gap: 1,
              }}
            >
              <AdminCheckboxField
                control={
                  <Checkbox
                    name="isActive"
                    defaultChecked={payload.product.status.isActive}
                  />
                }
                label={dictionary.fields.isActive}
              />
              <AdminCheckboxField
                control={
                  <Checkbox
                    name="visibleInShop"
                    defaultChecked={payload.product.status.visibleInShop}
                  />
                }
                label={dictionary.fields.visibleInShop}
              />
              <AdminCheckboxField
                control={
                  <Checkbox
                    name="visibleOnHome"
                    defaultChecked={payload.product.status.visibleOnHome}
                  />
                }
                label={dictionary.fields.visibleOnHome}
              />
              <AdminCheckboxField
                control={
                  <Checkbox
                    name="visibleInSearch"
                    defaultChecked={payload.product.status.visibleInSearch}
                  />
                }
                label={dictionary.fields.visibleInSearch}
              />
              <AdminCheckboxField
                control={
                  <Checkbox
                    name="featured"
                    defaultChecked={payload.product.merchandising.featured}
                  />
                }
                label={dictionary.fields.featured}
              />
              <AdminCheckboxField
                control={
                  <Checkbox
                    name="trackQuantity"
                    defaultChecked={payload.product.inventory.trackQuantity}
                  />
                }
                label={dictionary.fields.trackQuantity}
              />
              <AdminCheckboxField
                control={
                  <Checkbox
                    name="allowBackorder"
                    defaultChecked={payload.product.inventory.allowBackorder}
                  />
                }
                label={dictionary.fields.allowBackorder}
              />
            </Box>
          </AdminSectionCard>

          <AdminSectionCard
            title={dictionary.pricingSectionTitle}
            description={dictionary.pricingSectionDescription}
          >
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
              <TextField
                label={dictionary.fields.byPrice}
                name="pricing.BY.price"
                type="number"
                defaultValue={payload.product.pricing.BY?.price ?? 0}
              />
              <TextField
                select
                label={dictionary.fields.byCurrency}
                name="pricing.BY.currency"
                defaultValue={payload.product.pricing.BY?.currency ?? "BYN"}
              >
                <MenuItem value="BYN">BYN</MenuItem>
                <MenuItem value="USD">USD</MenuItem>
              </TextField>
              <TextField
                label={dictionary.fields.byOldPrice}
                name="pricing.BY.oldPrice"
                type="number"
                defaultValue={payload.product.pricing.BY?.oldPrice ?? ""}
              />
              <TextField
                label={dictionary.fields.usPrice}
                name="pricing.US.price"
                type="number"
                defaultValue={payload.product.pricing.US?.price ?? 0}
              />
              <TextField
                select
                label={dictionary.fields.usCurrency}
                name="pricing.US.currency"
                defaultValue={payload.product.pricing.US?.currency ?? "USD"}
              >
                <MenuItem value="USD">USD</MenuItem>
                <MenuItem value="BYN">BYN</MenuItem>
              </TextField>
              <TextField
                label={dictionary.fields.usOldPrice}
                name="pricing.US.oldPrice"
                type="number"
                defaultValue={payload.product.pricing.US?.oldPrice ?? ""}
              />
            </Box>
          </AdminSectionCard>

          {(["ru", "en"] as const).map((locale) => {
            const translation = payload.product.translations[locale];
            const details = payload.details.translations[locale];

            return (
              <AdminSectionCard
                key={locale}
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
                    <TextField
                      label={dictionary.fields.slug}
                      name={`${locale}.slug`}
                      defaultValue={translation.slug}
                      required
                    />
                    <input type="hidden" name={`${locale}.emoji`} value={translation.emoji} />
                    <input type="hidden" name={`${locale}.lang`} value={translation.lang ?? locale.toUpperCase()} />
                    <input type="hidden" name={`${locale}.detailOldPrice`} value={details.oldPrice ?? ""} />
                    <input type="hidden" name={`${locale}.imagesJson`} value={stringifyJson(details.images)} />
                    <input type="hidden" name={`${locale}.reviewsJson`} value={stringifyJson(details.reviews)} />
                    <input type="hidden" name={`${locale}.digitalAssetsJson`} value={stringifyJson(details.digitalAssets)} />
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
                      label={dictionary.fields.backgroundColor}
                      name={`${locale}.bgColor`}
                      defaultValue={translation.bgColor ?? ""}
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
                    <TextField
                      label={dictionary.fields.sku}
                      name={`${locale}.sku`}
                      defaultValue={details.sku}
                      required
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
                    <TextField
                      label={dictionary.fields.languages}
                      name={`${locale}.languagesText`}
                      defaultValue={stringifyOptionLines(details.languages)}
                      multiline
                      minRows={4}
                      helperText={dictionary.helpers.optionsRule}
                      fullWidth
                    />
                    <TextField
                      label={dictionary.fields.formats}
                      name={`${locale}.formatsText`}
                      defaultValue={stringifyOptionLines(details.formats)}
                      multiline
                      minRows={4}
                      helperText={dictionary.helpers.optionsRule}
                      fullWidth
                    />
                    <TextField
                      label={dictionary.fields.sizes}
                      name={`${locale}.sizesText`}
                      defaultValue={stringifyOptionLines(details.sizes)}
                      multiline
                      minRows={4}
                      helperText={dictionary.helpers.optionsRule}
                      fullWidth
                    />
                    <TextField
                      label={dictionary.fields.colors}
                      name={`${locale}.colorsText`}
                      defaultValue={stringifyOptionLines(details.colors)}
                      multiline
                      minRows={4}
                      helperText={dictionary.helpers.optionsRule}
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
                    <TextField
                      label={dictionary.fields.specs}
                      name={`${locale}.specsText`}
                      defaultValue={stringifySpecsLines(details.specs)}
                      multiline
                      minRows={5}
                      helperText={dictionary.helpers.specsRule}
                      fullWidth
                    />
                  </Box>
                </Stack>
              </AdminSectionCard>
            );
          })}

          <AdminSectionCard
            title={dictionary.relatedSectionTitle}
            description={dictionary.relatedSectionDescription}
            action={
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveOutlinedIcon />}
              >
                {submitLabel}
              </Button>
            }
          >
            <TextField
              label={dictionary.fields.relatedProductIds}
              name="relatedProductIds"
              defaultValue={payload.details.relatedProductIds.join(", ")}
              helperText={dictionary.helpers.relatedProductIds}
              fullWidth
            />
          </AdminSectionCard>
        </Stack>
      </form>
    </Stack>
  );
};

export type { AdminProductFormProps } from "./types";