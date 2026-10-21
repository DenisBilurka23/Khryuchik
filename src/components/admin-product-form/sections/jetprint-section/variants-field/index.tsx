"use client";

import { useState } from "react";
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { getInitialJetprintSkus, toJetprintVariantRows } from "../utils";
import type { AdminJetprintVariantsFieldProps } from "./types";
import { AdminJetprintVariantTableRow } from "./variant-row";

export const AdminJetprintVariantsField = ({
  name,
  blank,
  initialVariants,
}: AdminJetprintVariantsFieldProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");
  const rows = toJetprintVariantRows(blank, initialVariants);
  const [selectedSkus, setSelectedSkus] = useState(() =>
    getInitialJetprintSkus(blank, initialVariants),
  );

  const toggleSku = (sku: string) =>
    setSelectedSkus((current) =>
      current.includes(sku)
        ? current.filter((candidate) => candidate !== sku)
        : rows
            .map((row) => row.sku)
            .filter(
              (candidate) => candidate === sku || current.includes(candidate),
            ),
    );

  return (
    <Stack gap={1.5}>
      <input type="hidden" name={name} value={JSON.stringify(selectedSkus)} />

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {tJetprint("variantsTitle")}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tJetprint("variantsHelper")}
        </Typography>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                {tJetprint("columns.sell")}
              </TableCell>
              <TableCell>{tJetprint("columns.size")}</TableCell>
              <TableCell>{tJetprint("columns.color")}</TableCell>
              <TableCell>{tJetprint("columns.sku")}</TableCell>
              <TableCell>{tJetprint("columns.status")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <AdminJetprintVariantTableRow
                key={row.sku}
                row={row}
                isSelected={selectedSkus.includes(row.sku)}
                onToggleAction={() => toggleSku(row.sku)}
              />
            ))}
          </TableBody>
        </Table>
      </Box>
    </Stack>
  );
};

export type { AdminJetprintVariantsFieldProps } from "./types";
