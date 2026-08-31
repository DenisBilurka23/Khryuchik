"use client";

import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { groupRegionsByCurrency } from "@/utils";

import { AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductPricingSectionProps } from "./types";

export const AdminProductPricingSection = ({
  payload,
  regions,
  activeRegions,
  onToggleRegionAction,
  onToggleAllRegionsAction,
}: AdminProductPricingSectionProps) => {
  const tForm = useTranslations("adminPage.productForm");
  const currencyGroups = groupRegionsByCurrency(regions);
  const activeCount = regions.filter(
    (region) => activeRegions[region.code],
  ).length;

  return (
    <AdminSectionCard
      title={tForm("pricingSectionTitle")}
      description={tForm("pricingSectionDescription")}
    >
      <Stack gap={2.5}>
        <Stack gap={1}>
          <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
            {tForm("pricingRegionsTitle")}
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              columnGap: 2,
              rowGap: 0.5,
            }}
          >
            <FormControlLabel
              sx={{ mr: 0 }}
              control={
                <Checkbox
                  checked={activeCount === regions.length}
                  indeterminate={
                    activeCount > 0 && activeCount < regions.length
                  }
                  onChange={(event) =>
                    onToggleAllRegionsAction(event.target.checked)
                  }
                />
              }
              label={tForm("pricingRegionsSelectAll")}
            />
            <Divider flexItem orientation="vertical" sx={{ my: 1 }} />
            {regions.map((region) => (
              <FormControlLabel
                key={region.code}
                sx={{ mr: 0 }}
                control={
                  <Checkbox
                    name={`region.${region.code}.active`}
                    checked={Boolean(activeRegions[region.code])}
                    onChange={() => onToggleRegionAction(region.code)}
                  />
                }
                label={`${region.code} (${region.currency})`}
              />
            ))}
          </Box>
        </Stack>

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
          {currencyGroups.map((group) => {
            const currencyPricing = payload.product.pricing[group.currency];

            return (
              <Stack
                key={group.currency}
                gap={1.5}
                sx={{
                  p: 2,
                  borderRadius: "18px",
                  border: "1px solid #F0DFC8",
                  bgcolor: "#fff",
                }}
              >
                <Typography sx={{ fontWeight: 600 }}>
                  {`${group.currency} — ${group.regionCodes.join(", ")}`}
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    gap: 2,
                  }}
                >
                  <TextField
                    label={tForm("fields.currencyPrice", {
                      currency: group.currency,
                    })}
                    name={`pricing.${group.currency}.price`}
                    type="number"
                    defaultValue={currencyPricing?.price ?? ""}
                  />
                  <TextField
                    label={tForm("fields.currencyOldPrice", {
                      currency: group.currency,
                    })}
                    name={`pricing.${group.currency}.oldPrice`}
                    type="number"
                    defaultValue={currencyPricing?.oldPrice ?? ""}
                  />
                </Box>
              </Stack>
            );
          })}
        </Box>
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminProductPricingSectionProps } from "./types";
