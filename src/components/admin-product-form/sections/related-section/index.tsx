"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { searchAdminProductsClient } from "@/client-api/admin";

import { AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductRelatedSectionProps } from "./types";

const createFallbackOption = (id: string) => ({
  id,
  title: id,
  slug: "",
});

const mergeOptions = (...groups: Array<Array<{ id: string; title: string; slug: string }>>) => {
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
  submitLabel,
  payload,
  initialProductOptions,
  selectedProductOptions,
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
  const initialOptions = useMemo(
    () => mergeOptions(initialSelectedOptions, initialProductOptions),
    [initialProductOptions, initialSelectedOptions],
  );
  const [selectedOptions, setSelectedOptions] = useState(initialSelectedOptions);
  const [options, setOptions] = useState(initialOptions);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    setSelectedOptions(initialSelectedOptions);
  }, [initialSelectedOptions]);

  useEffect(() => {
    if (inputValue.trim()) {
      return;
    }

    setOptions(mergeOptions(selectedOptions, initialProductOptions));
  }, [initialProductOptions, inputValue, selectedOptions]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    const trimmedQuery = inputValue.trim();

    if (!trimmedQuery) {
      setIsLoading(false);
      setOptions(mergeOptions(selectedOptions, initialProductOptions));
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      const currentRequestId = requestIdRef.current + 1;
      requestIdRef.current = currentRequestId;
      setIsLoading(true);

      searchAdminProductsClient({
        locale,
        query: trimmedQuery,
        excludeProductId: payload.product.productId,
        limit: 10,
      })
        .then((response) => {
          if (requestIdRef.current !== currentRequestId) {
            return;
          }

          if (!response.ok) {
            throw new Error("Failed to load products");
          }

          setOptions(mergeOptions(selectedOptions, response.data?.items ?? []));
        })
        .catch(() => {
          if (requestIdRef.current !== currentRequestId) {
            return;
          }

          setOptions(mergeOptions(selectedOptions, initialProductOptions));
        })
        .finally(() => {
          if (requestIdRef.current === currentRequestId) {
            setIsLoading(false);
          }
        });
    }, 350);

    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [initialProductOptions, inputValue, locale, payload.product.productId, selectedOptions]);

  return (
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
      <input
        type="hidden"
        name="relatedProductIds"
        value={selectedOptions.map((option) => option.id).join(",")}
      />
      <Autocomplete
        multiple
        openOnFocus
        filterSelectedOptions
        options={options}
        value={selectedOptions}
        inputValue={inputValue}
        loading={isLoading}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.title}
        filterOptions={(currentOptions) => currentOptions}
        onChange={(_, value) => {
          setSelectedOptions(value);
        }}
        onInputChange={(_, value) => {
          setInputValue(value);
        }}
        slotProps={{
          popper: {
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: [0, 10],
                },
              },
            ],
          },
          paper: {
            sx: {
              borderRadius: "20px",
              border: "1px solid #EED9C2",
              boxShadow: "0 24px 60px rgba(39, 27, 20, 0.16), 0 10px 24px rgba(39, 27, 20, 0.10)",
              backgroundImage: "none",
            },
          },
        }}
        renderValue={(value, getItemProps) =>
          value.map((option, index) => {
            const itemProps = getItemProps({ index });

            return (
              <Chip
                {...itemProps}
                key={option.id}
                label={option.title}
                sx={{ borderRadius: "999px", fontWeight: 600, bgcolor: "#FFF4F6" }}
              />
            );
          })
        }
        renderOption={(props, option) => (
          <Box component="li" {...props} key={option.id}>
            <Stack spacing={0.25} sx={{ py: 0.5 }}>
              <Typography sx={{ fontWeight: 700 }}>{option.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {option.id}{option.slug ? ` • ${option.slug}` : ""}
              </Typography>
            </Stack>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label={dictionary.fields.relatedProductIds}
            placeholder={selectedOptions.length === 0 ? dictionary.fields.relatedProductIds : ""}
            helperText={dictionary.helpers.relatedProductIds}
            fullWidth
          />
        )}
        sx={{
          "& .MuiOutlinedInput-root": {
            alignItems: "flex-start",
            py: 0.75,
          },
        }}
      />
    </AdminSectionCard>
  );
};

export type { AdminProductRelatedSectionProps } from "./types";