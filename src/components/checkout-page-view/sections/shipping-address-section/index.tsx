import { Grid, Stack, TextField } from "@mui/material";

import { CountrySelect } from "@/components/country-select";
import { getRegionOptions, RegionSelect } from "@/components/region-select";
import { isRegionRequired, regionFieldKey } from "@/utils";

import { CheckoutSectionCard } from "../../section-card";
import type { ShippingAddressSectionProps } from "./types";

export const CheckoutShippingAddressSection = ({
  form,
  fieldErrors,
  onField,
  countries,
  onCountryChange,
  onRegionChange,
  onLocationFieldFocusChange,
  labels,
}: ShippingAddressSectionProps) => (
  <CheckoutSectionCard title={labels.shippingTitle}>
    <Stack spacing={2}>
      <TextField
        fullWidth
        required
        label={labels.fields.line1}
        value={form.line1}
        onChange={onField("line1")}
        error={Boolean(fieldErrors.line1)}
        helperText={fieldErrors.line1}
      />
      <TextField
        fullWidth
        label={labels.fields.line2}
        value={form.line2}
        onChange={onField("line2")}
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label={labels.fields.city}
            value={form.city}
            onChange={onField("city")}
            error={Boolean(fieldErrors.city)}
            helperText={fieldErrors.city}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          {getRegionOptions(form.country) ? (
            <RegionSelect
              required
              country={form.country}
              value={form.region}
              label={labels.fields[regionFieldKey(form.country)]}
              onChange={onRegionChange}
              error={Boolean(fieldErrors.region)}
              helperText={fieldErrors.region}
            />
          ) : (
            <TextField
              fullWidth
              required={isRegionRequired(form.country)}
              label={labels.fields[regionFieldKey(form.country)]}
              value={form.region}
              onChange={onField("region")}
              error={Boolean(fieldErrors.region)}
              helperText={fieldErrors.region}
              onFocus={() => onLocationFieldFocusChange(true)}
              onBlur={() => onLocationFieldFocusChange(false)}
            />
          )}
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            required
            label={labels.fields.postalCode}
            value={form.postalCode}
            onChange={onField("postalCode")}
            onFocus={() => onLocationFieldFocusChange(true)}
            onBlur={() => onLocationFieldFocusChange(false)}
            error={Boolean(fieldErrors.postalCode)}
            helperText={fieldErrors.postalCode}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CountrySelect
            required
            value={form.country}
            options={countries}
            label={labels.fields.country}
            onChange={onCountryChange}
            error={Boolean(fieldErrors.country)}
            helperText={fieldErrors.country}
          />
        </Grid>
      </Grid>
      <TextField
        fullWidth
        multiline
        minRows={2}
        label={labels.fields.notes}
        value={form.notes}
        onChange={onField("notes")}
      />
    </Stack>
  </CheckoutSectionCard>
);

export type { ShippingAddressSectionProps } from "./types";
