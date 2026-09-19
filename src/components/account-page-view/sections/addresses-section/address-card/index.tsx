"use client";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { ModalButton } from "@/components/modal-button";
import { IconTile, Pill, Plate } from "@/components/primitives";
import { secondaryButtonSx } from "@/theme/sx";
import {
  getUserShippingAddressLines,
  getUserShippingAddressTitle,
} from "@/utils/account-page";

import type { AddressCardProps } from "./types";

const cardSx = {
  borderRadius: "var(--radius-field)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "opacity 0.2s ease, border-color 0.2s ease",
} as const;

const titleSx = {
  fontWeight: 700,
  lineHeight: 1.45,
} as const;

const linesSx = {
  mt: 0.75,
  lineHeight: 1.8,
} as const;

const actionsSx = {
  mt: "auto",
  pt: 1.75,
  borderTop: "1px solid var(--color-border)",
} as const;

export const AddressCard = ({
  address,
  locale,
  isCurrent,
  isSelecting,
  isBusy,
  onSelect,
  onEdit,
  onDelete,
}: AddressCardProps) => {
  const t = useTranslations("accountPage");
  const lines = getUserShippingAddressLines(address, locale);

  return (
    <Plate
      pad="sm"
      sx={{
        ...cardSx,
        ...(isCurrent ? { borderColor: "var(--color-action)" } : null),
        opacity: isBusy ? 0.72 : 1,
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
        sx={{ mb: 2.5 }}
      >
        <IconTile tone="accent" sx={{ flexShrink: 0 }}>
          <LocationOnOutlinedIcon />
        </IconTile>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={titleSx}>
            {getUserShippingAddressTitle(address)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={linesSx}>
            {lines.map((line) => (
              <Box key={line} component="span" display="block">
                {line}
              </Box>
            ))}
          </Typography>
        </Box>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={1}
        sx={actionsSx}
      >
        {isCurrent ? (
          <Pill tone="accent">{t("currentAddress")}</Pill>
        ) : (
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            sx={secondaryButtonSx}
            onClick={onSelect}
            loading={isSelecting}
            disabled={isBusy}
          >
            {t("makeCurrent")}
          </Button>
        )}

        <Stack direction="row" spacing={0.5}>
          <Tooltip title={t("editAddress")}>
            <span>
              <IconButton
                size="small"
                aria-label={t("editAddress")}
                onClick={onEdit}
                disabled={isBusy}
              >
                <EditOutlinedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          <ModalButton
            iconOnly
            size="small"
            color="error"
            label={t("deleteAddress")}
            tooltip={t("deleteAddress")}
            ariaLabel={t("deleteAddress")}
            icon={<DeleteOutlineOutlinedIcon fontSize="small" />}
            disabled={isBusy}
            onConfirmAction={onDelete}
            dialogTitle={t("deleteAddressDialogTitle")}
            dialogDescription={t("deleteAddressDialogDescription")}
            confirmLabel={t("deleteAddressConfirmButton")}
            cancelLabel={t("cancel")}
          />
        </Stack>
      </Stack>
    </Plate>
  );
};

export type { AddressCardProps } from "./types";
