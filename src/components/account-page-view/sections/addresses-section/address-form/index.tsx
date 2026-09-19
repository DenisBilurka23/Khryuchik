"use client";

import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { CountrySelect } from "@/components/country-select";
import { Plate } from "@/components/primitives";
import { getRegionOptions, RegionSelect } from "@/components/region-select";
import { getAllCountriesSorted, regionFieldKey } from "@/utils";

import type { AddressFormProps } from "./types";

export const AddressForm = ({
  locale,
  title,
  value,
  isSaving,
  onFieldChange,
  onCountryChange,
  onSubmit,
  onCancel,
}: AddressFormProps) => {
  const t = useTranslations("accountPage");
  const tCheckoutFields = useTranslations("storefront.checkoutPage.fields");
  const allCountries = getAllCountriesSorted(locale);

  return (
    <Plate pad="sm">
      <Typography sx={{ fontWeight: 700, mb: 2 }}>{title}</Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            required
            label={tCheckoutFields("line1")}
            value={value.line1}
            onChange={(e) => onFieldChange("line1", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label={tCheckoutFields("line2")}
            value={value.line2 ?? ""}
            onChange={(e) =>
              onFieldChange("line2", e.target.value || undefined)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            required
            label={tCheckoutFields("city")}
            value={value.city}
            onChange={(e) => onFieldChange("city", e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          {getRegionOptions(value.country) ? (
            <RegionSelect
              required
              country={value.country}
              value={value.region ?? ""}
              label={tCheckoutFields(regionFieldKey(value.country))}
              onChange={(code) => onFieldChange("region", code || undefined)}
            />
          ) : (
            <TextField
              fullWidth
              label={tCheckoutFields("region")}
              value={value.region ?? ""}
              onChange={(e) =>
                onFieldChange("region", e.target.value || undefined)
              }
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            required
            label={tCheckoutFields("postalCode")}
            value={value.postalCode ?? ""}
            onChange={(e) =>
              onFieldChange("postalCode", e.target.value || undefined)
            }
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <CountrySelect
            required
            value={value.country}
            options={allCountries}
            label={t("addressCountryLabel")}
            onChange={onCountryChange}
          />
        </Grid>
      </Grid>

      <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
        <Button variant="contained" onClick={onSubmit} loading={isSaving}>
          {t("save")}
        </Button>
        <Button variant="outlined" color="inherit" onClick={onCancel}>
          {t("cancel")}
        </Button>
      </Stack>
    </Plate>
  );
};

export type { AddressFormProps } from "./types";
