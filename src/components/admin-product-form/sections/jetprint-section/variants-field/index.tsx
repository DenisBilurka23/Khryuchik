"use client";

import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import {
  buildJetprintOptionRows,
  createJetprintVariantRow,
  serializeJetprintVariantRows,
  toJetprintVariantRows,
} from "../utils";
import type {
  AdminJetprintVariantRow,
  AdminJetprintVariantsFieldProps,
} from "./types";
import { AdminJetprintVariantTableRow } from "./variant-row";
import { AdminJetprintVariantStatus } from "./variant-status";

export const AdminJetprintVariantsField = ({
  name,
  initialVariants,
  sizes,
  colors,
}: AdminJetprintVariantsFieldProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");
  const hasOptions = sizes.length > 0 || colors.length > 0;
  const [rows, setRows] = useState<AdminJetprintVariantRow[]>(() => {
    if (initialVariants.length > 0) {
      return toJetprintVariantRows(initialVariants);
    }

    return hasOptions
      ? buildJetprintOptionRows(sizes, colors)
      : [createJetprintVariantRow()];
  });

  const updateRow = (
    id: string,
    patch: Partial<Pick<AdminJetprintVariantRow, "sku" | "size" | "color">>,
  ) =>
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? {
              ...row,
              ...patch,
              ...(patch.sku !== undefined && patch.sku !== row.sku
                ? { isAvailable: undefined, checkedAt: undefined }
                : {}),
            }
          : row,
      ),
    );

  const hiddenInput = (
    <input
      type="hidden"
      name={name}
      value={serializeJetprintVariantRows(hasOptions ? rows : rows.slice(0, 1))}
    />
  );

  if (!hasOptions) {
    const [row] = rows;

    return (
      <Stack gap={1}>
        {hiddenInput}
        <Stack direction="row" gap={1.5} alignItems="center" flexWrap="wrap">
          <TextField
            size="small"
            label={tJetprint("columns.sku")}
            value={row.sku}
            onChange={(event) => updateRow(row.id, { sku: event.target.value })}
            sx={{ minWidth: 260 }}
          />
          <AdminJetprintVariantStatus row={row} />
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {tJetprint("singleSkuHelper")}
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack gap={1.5}>
      {hiddenInput}

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
              <TableCell>{tJetprint("columns.sku")}</TableCell>
              <TableCell>{tJetprint("columns.size")}</TableCell>
              <TableCell>{tJetprint("columns.color")}</TableCell>
              <TableCell>{tJetprint("columns.status")}</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <AdminJetprintVariantTableRow
                key={row.id}
                row={row}
                onChangeAction={(patch) => updateRow(row.id, patch)}
                onRemoveAction={() =>
                  setRows((current) =>
                    current.filter((candidate) => candidate.id !== row.id),
                  )
                }
              />
            ))}
          </TableBody>
        </Table>
      </Box>

      <Button
        variant="outlined"
        startIcon={<AddRoundedIcon />}
        sx={{ alignSelf: "flex-start" }}
        onClick={() =>
          setRows((current) => [...current, createJetprintVariantRow()])
        }
      >
        {tJetprint("addVariant")}
      </Button>
    </Stack>
  );
};

export type { AdminJetprintVariantsFieldProps } from "./types";
