import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Box,
  Button,
  Link as MuiLink,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import type { KeyboardEvent } from "react";
import { useTranslations } from "next-intl";

import { Note } from "@/components/primitives";
import type { PromoCodeStatus } from "@/hooks/usePromoCode.types";

import type { PromoCodeFieldProps } from "../types";

const rowSx = {
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  gap: 1.25,
} as const;

const messageKeyByStatus: Partial<Record<PromoCodeStatus, string>> = {
  "not-found": "notFound",
  inactive: "inactive",
  "already-used": "alreadyUsed",
  error: "error",
};

const messageSx = {
  mt: 1,
  fontSize: 13,
  lineHeight: 1.5,
  color: "var(--color-accent)",
} as const;

const noteSx = {
  alignItems: "center",
  paddingBlock: 1.25,
} as const;

const loginLinkSx = {
  fontWeight: 600,
  color: "var(--color-action)",
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
  isGuest,
  loginHref,
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

  if (isGuest) {
    return (
      <Box sx={sx}>
        <Note sx={noteSx}>
          <LockOutlinedIcon sx={appliedIconSx} />
          <Box component="span">
            {t("loginRequired")}{" "}
            <Link href={loginHref}>
              <MuiLink component="span" underline="hover" sx={loginLinkSx}>
                {t("loginLink")}
              </MuiLink>
            </Link>
          </Box>
        </Note>
      </Box>
    );
  }

  if (appliedPromo) {
    return (
      <Box sx={sx}>
        <Note sx={noteSx}>
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

      {messageKeyByStatus[status] ? (
        <Typography sx={messageSx}>{t(messageKeyByStatus[status])}</Typography>
      ) : null}
    </Box>
  );
};
