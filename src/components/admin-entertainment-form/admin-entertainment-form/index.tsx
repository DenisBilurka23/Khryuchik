"use client";

import { useCallback, useState } from "react";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Alert, Paper, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import { defaultLocale, type Locale } from "@/i18n/config";
import {
  AdminEntertainmentFormErrorCode,
  AdminEntertainmentFormMode,
} from "@/server/admin/entertainment-form-state";
import type { EntertainmentCategoryKey } from "@/types/entertainment";
import { getLocaleDisplayName } from "@/utils";

import { AdminConfirmSubmitButton } from "../../admin-page-shared";
import {
  AdminEntertainmentBaseSection,
  AdminEntertainmentLocaleSection,
  AdminEntertainmentMediaSection,
} from "../sections";
import { getEntertainmentMediaType } from "../utils";
import type { AdminEntertainmentFormProps } from "../types";

const submitCardSx = {
  p: { xs: 2, md: 2.75 },
  borderRadius: "28px",
  bgcolor: "#FFFFFF",
  border: "1px solid #F0DFC8",
  boxShadow: "0 18px 50px rgba(215, 167, 118, 0.12)",
} as const;

export const AdminEntertainmentForm = ({
  locale,
  item,
  activeLocales,
  action,
  isNew,
  errorCode,
}: AdminEntertainmentFormProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const [selectedCategory, setSelectedCategory] =
    useState<EntertainmentCategoryKey>(item.category);
  const [pendingUploads, setPendingUploads] = useState<Record<string, boolean>>(
    {},
  );
  const handlePendingChange = useCallback((key: string, isPending: boolean) => {
    setPendingUploads((current) => ({ ...current, [key]: isPending }));
  }, []);
  const hasPendingUploads = Object.values(pendingUploads).some(Boolean);
  const mediaType = getEntertainmentMediaType(selectedCategory);
  const errorMessage = (() => {
    switch (errorCode) {
      case AdminEntertainmentFormErrorCode.TitleRequired:
        return tForm("errorMessages.titleRequired");
      case AdminEntertainmentFormErrorCode.VideoRequired:
        return tForm("errorMessages.videoRequired");
      case AdminEntertainmentFormErrorCode.FileRequired:
        return tForm("errorMessages.fileRequired");
      case AdminEntertainmentFormErrorCode.StorageUnavailable:
        return tForm("errorMessages.storageUnavailable");
      case AdminEntertainmentFormErrorCode.SaveFailed:
        return tForm("errorMessages.saveFailed");
      case AdminEntertainmentFormErrorCode.DeleteFailed:
        return tForm("errorMessages.deleteFailed");
      case AdminEntertainmentFormErrorCode.Unexpected:
        return tForm("errorMessages.unexpected");
      default:
        return undefined;
    }
  })();

  return (
    <form action={action}>
      <input
        type="hidden"
        name="formMode"
        value={
          isNew
            ? AdminEntertainmentFormMode.New
            : AdminEntertainmentFormMode.Edit
        }
      />
      <input type="hidden" name="currentSlug" value={isNew ? "" : item.slug} />
      <input
        type="hidden"
        name="localeCodes"
        value={activeLocales.map((activeLocale) => activeLocale.code).join(",")}
      />

      <Stack gap={3}>
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <AdminEntertainmentBaseSection
          item={item}
          isNew={isNew}
          selectedCategory={selectedCategory}
          onCategoryChangeAction={setSelectedCategory}
        />

        <AdminEntertainmentMediaSection
          key={mediaType}
          item={item}
          mediaType={mediaType}
          onPendingChangeAction={handlePendingChange}
        />

        {activeLocales.map((activeLocale) => {
          const localeCode = activeLocale.code as Locale;

          return (
            <AdminEntertainmentLocaleSection
              key={localeCode}
              locale={localeCode}
              label={getLocaleDisplayName(localeCode, locale)}
              isDefaultLocale={localeCode === defaultLocale}
              slug={item.slug || undefined}
              translation={item.translations[localeCode]}
              onPendingChangeAction={handlePendingChange}
            />
          );
        })}

        <Paper elevation={0} sx={submitCardSx}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            gap={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            {hasPendingUploads ? (
              <Alert severity="info" sx={{ flex: 1 }}>
                {tForm("uploadInProgressNote")}
              </Alert>
            ) : (
              <span />
            )}

            <AdminConfirmSubmitButton
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              label={isNew ? tForm("createButton") : tForm("saveChangesButton")}
              pendingLabel={
                isNew ? tForm("creatingButton") : tForm("savingChangesButton")
              }
              disabled={hasPendingUploads}
              sx={{
                width: { xs: "100%", md: "auto" },
                minWidth: { md: 240 },
                minHeight: 56,
                px: { md: 4 },
                borderRadius: "20px",
              }}
            />
          </Stack>
        </Paper>
      </Stack>
    </form>
  );
};

export type { AdminEntertainmentFormProps } from "../types";
