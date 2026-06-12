"use client";

import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductPricingSectionProps } from "./types";

export const AdminProductPricingSection = ({
  payload,
  regions,
  isRegionActive,
  onToggleRegion,
}: AdminProductPricingSectionProps) => {
  const tForm = useTranslations("adminPage.productForm");

  return (
    <AdminSectionCard
      title={tForm("pricingSectionTitle")}
      description={tForm("pricingSectionDescription")}
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
        {regions.map((region) => {
          const regionPricing = payload.product.pricing[region.code];
          const active = isRegionActive(region.code);

          return (
            <Stack
              key={region.code}
              gap={1.5}
              sx={{
                p: 2,
                borderRadius: "18px",
                border: "1px solid #F0DFC8",
                bgcolor: active ? "#fff" : "#FBF4EA",
              }}
            >
              <FormControlLabel
                sx={{ mr: 0 }}
                control={
                  <Checkbox
                    name={`region.${region.code}.active`}
                    checked={active}
                    onChange={() => onToggleRegion(region.code)}
                  />
                }
                label={`${region.code} (${region.currency}) — ${tForm(
                  "regionActiveLabel",
                )}`}
              />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: 2,
                }}
              >
                <input
                  type="hidden"
                  name={`pricing.${region.code}.currency`}
                  value={region.currency}
                />
                <TextField
                  label={tForm("fields.regionPrice", { region: region.code })}
                  name={`pricing.${region.code}.price`}
                  type="number"
                  defaultValue={regionPricing?.price ?? ""}
                  disabled={!active}
                />
                <TextField
                  label={tForm("fields.regionOldPrice", {
                    region: region.code,
                  })}
                  name={`pricing.${region.code}.oldPrice`}
                  type="number"
                  defaultValue={regionPricing?.oldPrice ?? ""}
                  disabled={!active}
                />
              </Box>
            </Stack>
          );
        })}
      </Box>
    </AdminSectionCard>
  );
};

export type { AdminProductPricingSectionProps } from "./types";
