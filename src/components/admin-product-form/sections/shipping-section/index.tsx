"use client";

import { Fragment } from "react";
import { Box, Stack, TextField, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminSectionCard } from "../../../admin-page-shared";
import type { AdminProductShippingSectionProps } from "./types";

export const AdminProductShippingSection = ({
  payload,
  hubs,
  selectedType,
  languages,
  printedStock,
  getHubStock,
  onStockChangeAction,
}: AdminProductShippingSectionProps) => {
  const tForm = useTranslations("adminPage.productForm");
  const shipping = payload.product.shipping;
  return (
    <AdminSectionCard
      title={tForm("shippingSectionTitle")}
      description={tForm("shippingSectionDescription")}
    >
      <input
        type="hidden"
        name="shipping.stockByLanguage"
        value={JSON.stringify(printedStock)}
      />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
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
      </Box>

      {selectedType === "book" ? (
        <Stack gap={1} sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18 }}>
            {tForm("fields.printedStock")}
          </Typography>

          {languages.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {tForm("helpers.printedStockEmpty")}
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: `minmax(120px, 1fr) repeat(${hubs.length}, minmax(120px, 200px))`,
                alignItems: "center",
                columnGap: 2,
                p: 2,
                borderRadius: "18px",
                border: "1px solid #F0DFC8",
                bgcolor: "#fff",
                overflowX: "auto",
              }}
            >
              <Typography
                variant="caption"
                sx={{ fontWeight: 700, color: "text.secondary" }}
              >
                {tForm("fields.language")}
              </Typography>
              {hubs.map((hub) => (
                <Typography
                  key={`stock-head-${hub.code}`}
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "text.secondary",
                    textAlign: "center",
                  }}
                >
                  {hub.label}
                </Typography>
              ))}

              {languages.map((language) => (
                <Fragment key={`stock-row-${language.value}`}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {language.label}
                  </Typography>
                  {hubs.map((hub) => (
                    <Box
                      key={`stock-${language.value}-${hub.code}`}
                      sx={{ textAlign: "center" }}
                    >
                      <TextField
                        type="number"
                        size="small"
                        value={getHubStock(language.value, hub.code)}
                        onChange={(event) =>
                          onStockChangeAction(
                            language.value,
                            hub.code,
                            Number(event.target.value),
                          )
                        }
                        slotProps={{
                          htmlInput: {
                            min: 0,
                            step: 1,
                            "aria-label": `${language.label} — ${hub.label}`,
                          },
                        }}
                        sx={{ width: 96 }}
                      />
                    </Box>
                  ))}
                </Fragment>
              ))}
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            {tForm("helpers.printedStockRule")}
          </Typography>
        </Stack>
      ) : null}
    </AdminSectionCard>
  );
};

export type { AdminProductShippingSectionProps } from "./types";
