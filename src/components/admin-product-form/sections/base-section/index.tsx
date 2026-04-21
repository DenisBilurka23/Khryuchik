import { Box, Checkbox, MenuItem, TextField, Typography } from "@mui/material";

import { getAdminCategoryLabel } from "@/utils/admin";

import { AdminCheckboxField, AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductBaseSectionProps } from "./types";

const booksCategoryKey = "books";

export const AdminProductBaseSection = ({
  dictionary,
  sharedDictionary,
  payload,
  locale,
  isNew,
  selectedType,
  selectedCategory,
  merchCategories,
  onTypeChange,
  onCategoryChange,
}: AdminProductBaseSectionProps) => {
  return (
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
          helperText={dictionary.helpers.productId}
          slotProps={{ input: { readOnly: !isNew } }}
        />
        <TextField
          label={dictionary.fields.slug}
          name="slug"
          defaultValue={payload.product.slug}
          helperText={dictionary.helpers.slug}
        />
        <TextField
          label={dictionary.fields.sku}
          name="sku"
          defaultValue={payload.details.sku}
          helperText={dictionary.helpers.sku}
        />
        <TextField
          select
          label={dictionary.fields.type}
          name="type"
          value={selectedType}
          onChange={(event) => onTypeChange(event.target.value as typeof selectedType)}
        >
          <MenuItem value="book">
            {sharedDictionary.status.productTypes.book}
          </MenuItem>
          <MenuItem value="merch">
            {sharedDictionary.status.productTypes.merch}
          </MenuItem>
        </TextField>
        {selectedType === "book" ? (
          <input type="hidden" name="category" value={booksCategoryKey} />
        ) : (
          <TextField
            select
            label={dictionary.fields.category}
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
      </Box>
      <Typography
        variant="subtitle2"
        sx={{ mt: 2.5, mb: 1, fontWeight: 700, color: "text.secondary" }}
      >
        {dictionary.placementTitle}
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
      </Box>
    </AdminSectionCard>
  );
};

export type { AdminProductBaseSectionProps } from "./types";