import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { scrollMenuToKeyChar } from "@/utils/menu";

import { CheckoutSectionCard } from "../../section-card";
import type { ShippingAddressSectionProps } from "./types";

export const CheckoutShippingAddressSection = ({
  form,
  fieldErrors,
  onField,
  countries,
  onCountryChange,
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
          <TextField
            fullWidth
            label={labels.fields.region}
            value={form.region}
            onChange={onField("region")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label={labels.fields.postalCode}
            value={form.postalCode}
            onChange={onField("postalCode")}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth required error={Boolean(fieldErrors.country)}>
            <InputLabel>{labels.fields.country}</InputLabel>
            <Select
              value={form.country}
              label={labels.fields.country}
              onChange={(event) => onCountryChange(event.target.value)}
              MenuProps={{
                disablePortal: true,
                PaperProps: { sx: { maxHeight: 280 } },
                MenuListProps: { onKeyDown: scrollMenuToKeyChar },
              }}
            >
              {countries.map(({ code, label }) => (
                <MenuItem key={code} value={code}>
                  {label}
                </MenuItem>
              ))}
            </Select>
            {fieldErrors.country ? (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 1.75 }}
              >
                {fieldErrors.country}
              </Typography>
            ) : null}
          </FormControl>
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
