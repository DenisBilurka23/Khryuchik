import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { Box, Button, TextField, Typography } from "@mui/material";
import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

import { Note } from "@/components/primitives";

import type { PromoCodeFieldProps } from "../types";

const rowSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  gap: 1.25,
} as const;

const messageSx = {
  mt: 1,
  fontSize: 13,
  lineHeight: 1.5,
  color: "var(--color-accent)",
} as const;

const appliedNoteSx = {
  alignItems: "center",
} as const;

const appliedIconSx = {
  flexShrink: 0,
  fontSize: 18,
  color: "var(--color-action)",
} as const;

export const PromoCodeField = ({
  code,
  appliedPromo,
  status,
  onCodeChange,
  onApply,
  onRemove,
  sx,
}: PromoCodeFieldProps) => {
  const t = useTranslations("storefront.promoCode");

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    onApply();
  };

  if (appliedPromo) {
    return (
      <Box sx={sx}>
        <Note sx={appliedNoteSx}>
          <CheckCircleOutlinedIcon sx={appliedIconSx} />
          <Box component="span" sx={{ flex: 1 }}>
            {t("appliedLabel", {
              code: appliedPromo.code,
              percentOff: appliedPromo.percentOff,
            })}
          </Box>
          <Button
            type="button"
            size="small"
            onClick={onRemove}
            sx={{ flexShrink: 0 }}
          >
            {t("removeButton")}
          </Button>
        </Note>
      </Box>
    );
  }

  return (
    <Box sx={sx}>
      <Box sx={rowSx}>
        <TextField
          fullWidth
          value={code}
          placeholder={t("placeholder")}
          onChange={(event) => onCodeChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="button"
          variant="outlined"
          disabled={status === "loading" || code.trim().length === 0}
          onClick={onApply}
          sx={{ whiteSpace: "nowrap" }}
        >
          {t("applyButton")}
        </Button>
      </Box>

      {status === "not-found" || status === "inactive" || status === "error" ? (
        <Typography sx={messageSx}>
          {t(
            status === "not-found"
              ? "notFound"
              : status === "inactive"
                ? "inactive"
                : "error",
          )}
        </Typography>
      ) : null}
    </Box>
  );
};
