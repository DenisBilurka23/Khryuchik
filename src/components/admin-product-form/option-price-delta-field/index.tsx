"use client";

import { Box, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import type { ProductOptionPriceDelta } from "@/types/product-details";
import type { AdminOptionPriceDeltaFieldProps } from "./types";

const withRegionDelta = (
  priceDelta: ProductOptionPriceDelta | undefined,
  region: string,
  rawValue: string,
) => {
  const value = Number(rawValue.trim());
  const next = { ...priceDelta };

  if (!rawValue.trim() || !Number.isFinite(value) || value === 0) {
    delete next[region];
  } else {
    next[region] = value;
  }

  return Object.keys(next).length > 0 ? next : undefined;
};

export const AdminOptionPriceDeltaField = ({
  label,
  regions,
  priceDelta,
  onChangeAction,
}: AdminOptionPriceDeltaFieldProps) => {
  const tForm = useTranslations("adminPage.productForm");

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "minmax(56px, 88px) 1fr",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: 14 }} title={label} noWrap>
        {label}
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(92px, 1fr))",
          gap: 1,
        }}
      >
        {regions.map((region) => (
          <TextField
            key={region.code}
            label={tForm("fields.optionPriceDelta", {
              region: region.currency,
            })}
            type="number"
            size="small"
            value={priceDelta?.[region.code] ?? ""}
            onChange={(event) => {
              onChangeAction(
                withRegionDelta(priceDelta, region.code, event.target.value),
              );
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export type { AdminOptionPriceDeltaFieldProps } from "./types";
