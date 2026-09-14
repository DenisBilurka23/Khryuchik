"use client";

import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { MAX_PROMO_CODE_LENGTH } from "@/constants/promo";
import { generatePromoCode } from "@/utils";

import type { AdminPromoCodeInputProps } from "./types";

export const AdminPromoCodeInput = ({
  existingCodes,
}: AdminPromoCodeInputProps) => {
  const tPromoCodes = useTranslations("adminPage.promocodes");
  const [code, setCode] = useState("");
  const generateLabel = tPromoCodes("generateButton");

  const handleGenerate = () => {
    setCode(generatePromoCode(new Set(existingCodes)));
  };

  return (
    <TextField
      label={tPromoCodes("fields.code")}
      name="code"
      required
      value={code}
      onChange={(event) => setCode(event.target.value)}
      slotProps={{
        htmlInput: { maxLength: MAX_PROMO_CODE_LENGTH },
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={generateLabel}>
                <IconButton
                  type="button"
                  edge="end"
                  aria-label={generateLabel}
                  onClick={handleGenerate}
                >
                  <AutorenewOutlinedIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

export type { AdminPromoCodeInputProps } from "./types";
