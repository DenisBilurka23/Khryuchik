"use client";

import { useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminSectionCard } from "@/components/admin-page-shared";

import { AdminJetprintSectionFields } from "./fields";
import type { AdminProductJetprintSectionProps } from "./types";

export const AdminProductJetprintSection = ({
  locale,
  productId,
  link,
  sizes,
  colors,
}: AdminProductJetprintSectionProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");
  const [isEnabled, setIsEnabled] = useState(Boolean(link));

  return (
    <AdminSectionCard
      title={tJetprint("sectionTitle")}
      description={tJetprint("sectionDescription")}
    >
      <Stack gap={3}>
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                name="jetprint.enabled"
                checked={isEnabled}
                onChange={(event) => setIsEnabled(event.target.checked)}
              />
            }
            label={tJetprint("enabled")}
          />
          <Typography variant="body2" color="text.secondary">
            {tJetprint("enabledHelper")}
          </Typography>
        </Box>

        {isEnabled ? (
          <AdminJetprintSectionFields
            locale={locale}
            productId={productId}
            link={link}
            sizes={sizes}
            colors={colors}
          />
        ) : null}
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminProductJetprintSectionProps } from "./types";
