"use client";

import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import type { ShippingHubCode } from "@/types/shipping";

import { AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductShippingSectionProps } from "./types";

export const AdminProductShippingSection = ({
  payload,
  hubs,
}: AdminProductShippingSectionProps) => {
  const tForm = useTranslations("adminPage.productForm");
  const shipping = payload.product.shipping;
  const manufacturer = shipping?.manufacturer;
  const [defaultHubs, setDefaultHubs] = useState<ShippingHubCode[]>(
    shipping?.hubs ?? [],
  );

  const toggleHub = (hub: ShippingHubCode) => {
    setDefaultHubs((prev) =>
      prev.includes(hub)
        ? prev.filter((entry) => entry !== hub)
        : [...prev, hub],
    );
  };

  return (
    <AdminSectionCard
      title={tForm("shippingSectionTitle")}
      description={tForm("shippingSectionDescription")}
    >
      <input type="hidden" name="shipping.hubs" value={defaultHubs.join(",")} />
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
          type="number"
          label={tForm("fields.weightGrams")}
          name="shipping.weightGrams"
          defaultValue={shipping?.weightGrams ?? ""}
          helperText={tForm("helpers.weightGrams")}
        />
        <TextField
          label={tForm("fields.hsCode")}
          name="shipping.hsCode"
          defaultValue={shipping?.hsCode ?? ""}
          helperText={tForm("helpers.hsCode")}
        />
        <TextField
          type="number"
          label={tForm("fields.lengthMm")}
          name="shipping.lengthMm"
          defaultValue={shipping?.lengthMm ?? ""}
        />
        <TextField
          type="number"
          label={tForm("fields.widthMm")}
          name="shipping.widthMm"
          defaultValue={shipping?.widthMm ?? ""}
        />
        <TextField
          type="number"
          label={tForm("fields.heightMm")}
          name="shipping.heightMm"
          defaultValue={shipping?.heightMm ?? ""}
        />
        <TextField
          label={tForm("fields.originCountry")}
          name="shipping.originCountry"
          defaultValue={shipping?.originCountry ?? ""}
          helperText={tForm("helpers.originCountry")}
        />
      </Box>

      <Stack gap={1} sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18 }}>
          {tForm("fields.manufacturer")}
        </Typography>
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
            label={tForm("fields.manufacturerName")}
            name="shipping.manufacturer.name"
            defaultValue={manufacturer?.name ?? ""}
          />
          <TextField
            label={tForm("fields.manufacturerStreet")}
            name="shipping.manufacturer.street"
            defaultValue={manufacturer?.street ?? ""}
          />
          <TextField
            label={tForm("fields.manufacturerCity")}
            name="shipping.manufacturer.city"
            defaultValue={manufacturer?.city ?? ""}
          />
          <TextField
            label={tForm("fields.manufacturerRegionCode")}
            name="shipping.manufacturer.regionCode"
            defaultValue={manufacturer?.regionCode ?? ""}
          />
          <TextField
            label={tForm("fields.manufacturerPostalCode")}
            name="shipping.manufacturer.postalCode"
            defaultValue={manufacturer?.postalCode ?? ""}
          />
          <TextField
            label={tForm("fields.manufacturerCountry")}
            name="shipping.manufacturer.country"
            defaultValue={manufacturer?.country ?? ""}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {tForm("helpers.manufacturerRule")}
        </Typography>
      </Stack>

      <Stack gap={0.5} sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18 }}>
          {tForm("fields.defaultHubs")}
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} gap={{ xs: 0, sm: 2 }}>
          {hubs.map((hub) => (
            <FormControlLabel
              key={`shipping-hub-${hub.code}`}
              control={
                <Checkbox
                  checked={defaultHubs.includes(hub.code)}
                  onChange={() => toggleHub(hub.code)}
                />
              }
              label={hub.label}
            />
          ))}
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {tForm("helpers.defaultHubsRule")}
        </Typography>
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminProductShippingSectionProps } from "./types";
