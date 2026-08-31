"use client";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { Stack, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

import { ModalButton } from "@/components/modal-button";
import { formatCurrency, formatManufacturerAddress } from "@/utils";

import type { AdminOrderCustomsButtonProps } from "./types";

const MM_PER_CM = 10;

export const AdminOrderCustomsButton = ({
  locale,
  parcel,
}: AdminOrderCustomsButtonProps) => {
  const t = useTranslations("adminPage.orders.customs");
  const label = t("button");
  const missing = t("missing");
  const manufacturer = parcel.contents.find(
    (item) => item.manufacturer,
  )?.manufacturer;

  const rows: { label: string; value: string }[] = [
    {
      label: t("valueLabel"),
      value: formatCurrency(parcel.valueAmount, locale, parcel.valueCurrency),
    },
    {
      label: t("weightLabel"),
      value: t("weightValue", { grams: parcel.weightGrams }),
    },
    {
      label: t("sizeLabel"),
      value: t("sizeValue", {
        length: parcel.lengthMm / MM_PER_CM,
        width: parcel.widthMm / MM_PER_CM,
        height: parcel.heightMm / MM_PER_CM,
      }),
    },
    {
      label: t("manufacturerLabel"),
      value: manufacturer
        ? `${manufacturer.name}, ${formatManufacturerAddress(manufacturer)}`
        : missing,
    },
  ];

  return (
    <ModalButton
      label={label}
      dialogTitle={t("dialogTitle")}
      dialogDescription={t("dialogDescription")}
      cancelLabel={t("closeLabel")}
      tooltip={label}
      ariaLabel={label}
      icon={<DescriptionOutlinedIcon key="customs-icon" />}
      iconOnly
      size="small"
      color="primary"
    >
      <Stack spacing={1.5} sx={{ mt: 2, minWidth: 360 }}>
        {rows.map((row) => (
          <Stack key={row.label} spacing={0.25}>
            <Typography variant="caption" color="text.secondary">
              {row.label}
            </Typography>
            <Typography variant="body2">{row.value}</Typography>
          </Stack>
        ))}

        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            {t("itemsLabel")}
          </Typography>
          {parcel.contents.map((item, index) => (
            <Typography key={index} variant="body2">
              {t("itemValue", {
                quantity: item.quantity,
                value: formatCurrency(
                  item.valueAmount,
                  locale,
                  parcel.valueCurrency,
                ),
                hsCode: item.hsCode ?? missing,
                origin: item.originCountry ?? missing,
              })}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </ModalButton>
  );
};

export type { AdminOrderCustomsButtonProps } from "./types";
