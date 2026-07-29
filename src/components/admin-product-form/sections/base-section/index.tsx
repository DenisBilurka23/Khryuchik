import { Box, Checkbox, MenuItem, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { BOOKS_CATEGORY_KEY } from "@/constants/catalog";
import { getAdminCategoryLabel } from "@/utils/admin";

import {
  AdminCheckboxField,
  AdminSectionCard,
} from "../../../admin-page-shared";
import { AdminFormatsField } from "../../formats-field";
import { AdminLanguagesField } from "../../languages-field";
import type { AdminProductBaseSectionProps } from "./types";

export const AdminProductBaseSection = ({
  payload,
  locale,
  isNew,
  selectedType,
  selectedCategory,
  merchCategories,
  onTypeChange,
  onCategoryChange,
  availableLocales,
  initialLanguages,
  initialFormats,
}: AdminProductBaseSectionProps) => {
  const tForm = useTranslations("adminPage.productForm");
  const tShared = useTranslations("adminPage.shared");
  const isPrintifyManaged = Boolean(payload.product.printify);

  return (
    <AdminSectionCard
      title={tForm("baseSectionTitle")}
      description={tForm("baseSectionDescription")}
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
          label={tForm("fields.productId")}
          name="productId"
          defaultValue={payload.product.productId}
          helperText={tForm("helpers.productId")}
          slotProps={{ input: { readOnly: !isNew } }}
        />
        <TextField
          label={tForm("fields.slug")}
          name="slug"
          defaultValue={payload.product.slug}
          helperText={tForm("helpers.slug")}
        />
        <TextField
          label={tForm("fields.sku")}
          name="sku"
          defaultValue={payload.details.sku}
          helperText={tForm("helpers.sku")}
        />
        <TextField
          select
          label={tForm("fields.type")}
          name="type"
          value={selectedType}
          onChange={(event) =>
            onTypeChange(event.target.value as typeof selectedType)
          }
        >
          <MenuItem value="book">
            {tShared("status.productTypes.book")}
          </MenuItem>
          <MenuItem value="merch">
            {tShared("status.productTypes.merch")}
          </MenuItem>
        </TextField>
        {selectedType === "book" ? (
          <input type="hidden" name="category" value={BOOKS_CATEGORY_KEY} />
        ) : (
          <TextField
            select
            label={tForm("fields.category")}
            name="category"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
          >
            {merchCategories.map((category) => (
              <MenuItem key={category.key} value={category.key}>
                {getAdminCategoryLabel(category.translations, locale) ||
                  category.key}
              </MenuItem>
            ))}
          </TextField>
        )}
        <TextField
          label={tForm("fields.sortOrder")}
          name="sortOrder"
          type="number"
          defaultValue={payload.product.merchandising.sortOrder}
        />
        <TextField
          select
          label={tForm("fields.availability")}
          name="availability"
          defaultValue={payload.product.inventory.availability}
          disabled={isPrintifyManaged}
          helperText={
            isPrintifyManaged ? tForm("printifyManagedStock") : undefined
          }
        >
          <MenuItem value="in_stock">
            {tShared("status.availability.in_stock")}
          </MenuItem>
          <MenuItem value="out_of_stock">
            {tShared("status.availability.out_of_stock")}
          </MenuItem>
          <MenuItem value="preorder">
            {tShared("status.availability.preorder")}
          </MenuItem>
          <MenuItem value="made_to_order">
            {tShared("status.availability.made_to_order")}
          </MenuItem>
        </TextField>
        <TextField
          label={tForm("fields.quantity")}
          name="quantity"
          type="number"
          defaultValue={payload.product.inventory.quantity ?? ""}
          disabled={isPrintifyManaged}
        />
      </Box>
      {selectedType === "book" && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
            gap: 2,
            mt: 2,
          }}
        >
          <AdminLanguagesField
            name="languagesJson"
            title={tForm("fields.languages")}
            helperText={tForm("helpers.languagesSelectRule")}
            adminLocale={locale}
            availableLocales={availableLocales}
            initialOptions={initialLanguages}
          />
          <AdminFormatsField
            name="formatsJson"
            title={tForm("fields.formats")}
            helperText={tForm("helpers.formatsRule")}
            printedLabel={tForm("fields.formatPrinted")}
            digitalLabel={tForm("fields.formatDigital")}
            initialFormats={initialFormats}
          />
        </Box>
      )}
      <Typography
        variant="subtitle2"
        sx={{ mt: 2.5, mb: 1, fontWeight: 700, color: "text.secondary" }}
      >
        {tForm("placementTitle")}
      </Typography>
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
          label={tForm("fields.isActive")}
        />
        <AdminCheckboxField
          control={
            <Checkbox
              name="visibleInShop"
              defaultChecked={payload.product.status.visibleInShop}
            />
          }
          label={tForm("fields.visibleInShop")}
        />
        <AdminCheckboxField
          control={
            <Checkbox
              name="visibleOnHome"
              defaultChecked={payload.product.status.visibleOnHome}
            />
          }
          label={tForm("fields.visibleOnHome")}
        />
        <AdminCheckboxField
          control={
            <Checkbox
              name="notifySubscribers"
              defaultChecked={payload.product.status.notifySubscribers}
            />
          }
          label={tForm("fields.notifySubscribers")}
        />
      </Box>
    </AdminSectionCard>
  );
};

export type { AdminProductBaseSectionProps } from "./types";
