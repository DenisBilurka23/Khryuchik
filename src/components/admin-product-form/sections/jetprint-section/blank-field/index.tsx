"use client";

import { MenuItem, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import type { AdminJetprintBlankFieldProps } from "./types";

export const AdminJetprintBlankField = ({
  name,
  blanks,
  value,
  onChangeAction,
}: AdminJetprintBlankFieldProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <TextField
        select
        size="small"
        label={tJetprint("blankLabel")}
        value={value}
        onChange={(event) => onChangeAction(event.target.value)}
        helperText={tJetprint("blankHelper")}
        slotProps={{
          inputLabel: { shrink: true },
          select: { displayEmpty: true },
        }}
        sx={{ maxWidth: 420 }}
      >
        <MenuItem value="" disabled>
          {tJetprint("blankPlaceholder")}
        </MenuItem>
        {blanks.map((blank) => (
          <MenuItem key={blank.id} value={blank.id}>
            {blank.name}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
};

export type {
  AdminJetprintBlankFieldProps,
  AdminJetprintBlankOption,
} from "./types";
