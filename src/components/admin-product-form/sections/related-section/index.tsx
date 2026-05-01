"use client";

import { useEffect, useMemo, useState } from "react";

import { Stack } from "@mui/material";

import type { AdminProductOption } from "@/types/admin";

import { AdminSectionCard } from "../../../admin-page-shared";
import { AdminProductAutocompleteField } from "./product-autocomplete-field";
import type { AdminProductRelatedSectionProps } from "./types";
import { useProductSearch } from "./use-product-search";

const createFallbackOption = (id: string): AdminProductOption => ({
  id,
  title: id,
  slug: "",
});

const mergeOptions = (...groups: AdminProductOption[][]) => {
  const seen = new Set<string>();

  return groups.flat().filter((option) => {
    if (seen.has(option.id)) {
      return false;
    }

    seen.add(option.id);
    return true;
  });
};

export const AdminProductRelatedSection = ({
  locale,
  dictionary,
  payload,
  initialProductOptions,
  selectedProductOptions,
  selectedStoryProductOption,
}: AdminProductRelatedSectionProps) => {
  const initialSelectedOptions = useMemo(
    () =>
      payload.details.relatedProductIds
        .map(
          (id) =>
            selectedProductOptions.find((option) => option.id === id) ??
            createFallbackOption(id),
        )
        .filter(
          (option, index, options) =>
            options.findIndex((item) => item.id === option.id) === index,
        ),
    [payload.details.relatedProductIds, selectedProductOptions],
  );
  const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);
  const [selectedStoryOption, setSelectedStoryOption] = useState(
    selectedStoryProductOption ?? null,
  );
  const [inputValue, setInputValue] = useState("");
  const [storyInputValue, setStoryInputValue] = useState("");

  useEffect(() => {
    setSelectedOptions(initialSelectedOptions);
  }, [initialSelectedOptions]);

  useEffect(() => {
    setSelectedStoryOption(selectedStoryProductOption ?? null);
  }, [selectedStoryProductOption]);

  const fallbackOptions = useMemo(
    () =>
      mergeOptions(
        selectedOptions,
        selectedStoryOption ? [selectedStoryOption] : [],
        initialProductOptions,
      ),
    [initialProductOptions, selectedOptions, selectedStoryOption],
  );

  const { options: relatedSearchOptions, isLoading } = useProductSearch({
    locale,
    query: inputValue,
    excludeProductId: payload.product.productId,
    fallbackOptions,
  });
  const { options: storySearchOptions, isLoading: isStoryLoading } = useProductSearch({
    locale,
    query: storyInputValue,
    excludeProductId: payload.product.productId,
    fallbackOptions,
  });

  const relatedOptions = useMemo(
    () => mergeOptions(fallbackOptions, relatedSearchOptions),
    [fallbackOptions, relatedSearchOptions],
  );
  const storyOptions = useMemo(
    () => mergeOptions(fallbackOptions, storySearchOptions),
    [fallbackOptions, storySearchOptions],
  );

  return (
    <AdminSectionCard
      title={dictionary.relatedSectionTitle}
      description={dictionary.relatedSectionDescription}
    >
      <input
        type="hidden"
        name="storyProductId"
        value={selectedStoryOption?.id ?? ""}
      />
      <input
        type="hidden"
        name="relatedProductIds"
        value={selectedOptions.map((option) => option.id).join(",")}
      />
      <Stack gap={2}>
        <AdminProductAutocompleteField
          options={storyOptions}
          value={selectedStoryOption}
          inputValue={storyInputValue}
          loading={isStoryLoading}
          label={dictionary.fields.storyProductId}
          placeholder={dictionary.fields.storyProductId}
          helperText={dictionary.helpers.storyProductId}
          onChangeAction={(_, value) => {
            setSelectedStoryOption(Array.isArray(value) ? null : value);
          }}
          onInputChangeAction={(_, value) => {
            setStoryInputValue(value);
          }}
        />
        <AdminProductAutocompleteField
          multiple
          openOnFocus
          filterSelectedOptions
          options={relatedOptions}
          value={selectedOptions}
          inputValue={inputValue}
          loading={isLoading}
          label={dictionary.fields.relatedProductIds}
          placeholder={dictionary.fields.relatedProductIds}
          helperText={dictionary.helpers.relatedProductIds}
          onChangeAction={(_, value) => {
            setSelectedOptions(Array.isArray(value) ? value : []);
          }}
          onInputChangeAction={(_, value) => {
            setInputValue(value);
          }}
        />
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminProductRelatedSectionProps } from "./types";