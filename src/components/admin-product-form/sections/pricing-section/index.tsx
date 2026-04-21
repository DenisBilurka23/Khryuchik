import { Box, TextField } from "@mui/material";

import { AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductPricingSectionProps } from "./types";

export const AdminProductPricingSection = ({
  dictionary,
  payload,
}: AdminProductPricingSectionProps) => {
  return (
    <AdminSectionCard
      title={dictionary.pricingSectionTitle}
      description={dictionary.pricingSectionDescription}
    >
      <input type="hidden" name="pricing.BY.currency" value="BYN" />
      <input type="hidden" name="pricing.US.currency" value="USD" />
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
          defaultValue={payload.product.pricing.BY?.price ?? ""}
        />
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
          defaultValue={payload.product.pricing.US?.price ?? ""}
        />
        <TextField
          label={dictionary.fields.usOldPrice}
          name="pricing.US.oldPrice"
          type="number"
          defaultValue={payload.product.pricing.US?.oldPrice ?? ""}
        />
      </Box>
    </AdminSectionCard>
  );
};

export type { AdminProductPricingSectionProps } from "./types";