"use client";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import {
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminJetprintVariantStatus } from "../variant-status";
import type { AdminJetprintVariantTableRowProps } from "./types";

export const AdminJetprintVariantTableRow = ({
  row,
  onChangeAction,
  onRemoveAction,
}: AdminJetprintVariantTableRowProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");

  return (
    <TableRow>
      <TableCell sx={{ minWidth: 180 }}>
        <TextField
          size="small"
          fullWidth
          value={row.sku}
          onChange={(event) => onChangeAction({ sku: event.target.value })}
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
          onChange={(event) => onChangeAction({ size: event.target.value })}
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
          onChange={(event) => onChangeAction({ color: event.target.value })}
          slotProps={{
            htmlInput: { "aria-label": tJetprint("columns.color") },
          }}
        />
      </TableCell>
      <TableCell>
        <AdminJetprintVariantStatus row={row} />
      </TableCell>
      <TableCell align="right">
        <Tooltip title={tJetprint("removeVariant")}>
          <IconButton
            size="small"
            aria-label={tJetprint("removeVariant")}
            onClick={onRemoveAction}
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

export type { AdminJetprintVariantTableRowProps } from "./types";
