import { Stack, TextField } from "@mui/material";

import { CheckoutSectionCard } from "../../section-card";
import type { ContactSectionProps } from "./types";

export const CheckoutContactSection = ({
  form,
  fieldErrors,
  onField,
  labels,
}: ContactSectionProps) => (
  <CheckoutSectionCard title={labels.contactTitle}>
    <Stack spacing={2}>
      <TextField
        fullWidth
        required
        label={labels.fields.name}
        value={form.name}
        onChange={onField("name")}
        error={Boolean(fieldErrors.name)}
        helperText={fieldErrors.name}
      />
      <TextField
        fullWidth
        required
        type="email"
        label={labels.fields.email}
        value={form.email}
        onChange={onField("email")}
        error={Boolean(fieldErrors.email)}
        helperText={fieldErrors.email}
      />
      <TextField
        fullWidth
        label={labels.fields.phone}
        value={form.phone}
        onChange={onField("phone")}
      />
    </Stack>
  </CheckoutSectionCard>
);

export type { ContactSectionProps } from "./types";
