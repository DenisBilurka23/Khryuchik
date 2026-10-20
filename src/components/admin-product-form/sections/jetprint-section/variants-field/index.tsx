"use client";

import { useState } from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import jetprintBlanks from "@/data/jetprint-blanks.json";
import { AdminStatusChip } from "@/components/admin-page-shared";
import type { JetprintBlankCatalog } from "@/types/catalog";
import { findJetprintBlankBySku } from "@/utils";

import {
  buildJetprintOptionRows,
  createJetprintVariantRow,
  getJetprintVariantStatus,
  serializeJetprintVariantRows,
  toJetprintVariantRows,
} from "../utils";
import type {
  AdminJetprintVariantRow,
  AdminJetprintVariantsFieldProps,
} from "./types";

const blankCatalog: JetprintBlankCatalog = jetprintBlanks;

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

  const renderStatus = (row: AdminJetprintVariantRow) => {
    const status = getJetprintVariantStatus(
      row,
      Boolean(findJetprintBlankBySku(blankCatalog, row.sku.trim())),
    );

    return (
      <AdminStatusChip
        label={tJetprint(`variantStatus.${status.key}`)}
        tone={status.tone}
      />
    );
  };

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
          {renderStatus(row)}
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
              <TableRow key={row.id}>
                <TableCell sx={{ minWidth: 180 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={row.sku}
                    onChange={(event) =>
                      updateRow(row.id, { sku: event.target.value })
                    }
                    slotProps={{
                      htmlInput: { "aria-label": tJetprint("columns.sku") },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={row.size}
                    onChange={(event) =>
                      updateRow(row.id, { size: event.target.value })
                    }
                    slotProps={{
                      htmlInput: { "aria-label": tJetprint("columns.size") },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ minWidth: 120 }}>
                  <TextField
                    size="small"
                    fullWidth
                    value={row.color}
                    onChange={(event) =>
                      updateRow(row.id, { color: event.target.value })
                    }
                    slotProps={{
                      htmlInput: { "aria-label": tJetprint("columns.color") },
                    }}
                  />
                </TableCell>
                <TableCell>{renderStatus(row)}</TableCell>
                <TableCell align="right">
                  <Tooltip title={tJetprint("removeVariant")}>
                    <IconButton
                      size="small"
                      aria-label={tJetprint("removeVariant")}
                      onClick={() =>
                        setRows((current) =>
                          current.filter(
                            (candidate) => candidate.id !== row.id,
                          ),
                        )
                      }
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
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
