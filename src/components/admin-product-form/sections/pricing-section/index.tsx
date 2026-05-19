import { Box, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductPricingSectionProps } from "./types";

export const AdminProductPricingSection = ({
  payload,
}: AdminProductPricingSectionProps) => {
  const tForm = useTranslations("adminPage.productForm");

  return (
    <AdminSectionCard
      title={tForm("pricingSectionTitle")}
      description={tForm("pricingSectionDescription")}
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
          label={tForm("fields.byPrice")}
          name="pricing.BY.price"
          type="number"
          defaultValue={payload.product.pricing.BY?.price ?? ""}
        />
        <TextField
          label={tForm("fields.byOldPrice")}
          name="pricing.BY.oldPrice"
          type="number"
          defaultValue={payload.product.pricing.BY?.oldPrice ?? ""}
        />
        <TextField
          label={tForm("fields.usPrice")}
          name="pricing.US.price"
          type="number"
          defaultValue={payload.product.pricing.US?.price ?? ""}
        />
        <TextField
          label={tForm("fields.usOldPrice")}
          name="pricing.US.oldPrice"
          type="number"
          defaultValue={payload.product.pricing.US?.oldPrice ?? ""}
        />
      </Box>
    </AdminSectionCard>
  );
};

export type { AdminProductPricingSectionProps } from "./types";