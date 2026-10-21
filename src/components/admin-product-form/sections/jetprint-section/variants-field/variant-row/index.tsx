"use client";

import { Box, Checkbox, Stack, TableCell, TableRow } from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminJetprintVariantStatus } from "../variant-status";
import type { AdminJetprintVariantTableRowProps } from "./types";

const swatchSx = {
  width: 14,
  height: 14,
  borderRadius: "50%",
  border: "1px solid",
  borderColor: "divider",
  flexShrink: 0,
} as const;

export const AdminJetprintVariantTableRow = ({
  row,
  isSelected,
  onToggleAction,
}: AdminJetprintVariantTableRowProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");
  const emptyValue = tJetprint("emptyValue");

  return (
    <TableRow hover selected={isSelected}>
      <TableCell padding="checkbox">
        <Checkbox
          checked={isSelected}
          onChange={onToggleAction}
          slotProps={{
            input: { "aria-label": `${tJetprint("columns.sell")}: ${row.sku}` },
          }}
        />
      </TableCell>
      <TableCell>{row.size ?? emptyValue}</TableCell>
      <TableCell>
        {row.color ? (
          <Stack direction="row" gap={1} alignItems="center">
            {row.colorHex ? (
              <Box
                component="span"
                sx={swatchSx}
                style={{ backgroundColor: row.colorHex }}
              />
            ) : null}
            {row.color}
          </Stack>
        ) : (
          emptyValue
        )}
      </TableCell>
      <TableCell sx={{ fontFamily: "monospace" }}>{row.sku}</TableCell>
      <TableCell>
        <AdminJetprintVariantStatus row={row} />
      </TableCell>
    </TableRow>
  );
};

export type { AdminJetprintVariantTableRowProps } from "./types";
