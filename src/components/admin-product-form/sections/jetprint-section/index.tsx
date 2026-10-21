"use client";

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
  isEnabled,
  onEnabledChangeAction,
}: AdminProductJetprintSectionProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");

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
                onChange={(event) =>
                  onEnabledChangeAction(event.target.checked)
                }
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
          />
        ) : null}
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminProductJetprintSectionProps } from "./types";
