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
  AdminEntertainmentAudioSection,
  AdminEntertainmentBaseSection,
  AdminEntertainmentLocaleSection,
  AdminEntertainmentMediaSection,
  AdminEntertainmentSubtitleSection,
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
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const hasStoredTranslations = Object.values(item.translations).some(
    (translation) => translation?.title,
  );
  const [activeLocaleCodes, setActiveLocaleCodes] = useState<
    Record<string, boolean>
  >(() =>
    activeLocales.reduce<Record<string, boolean>>(
      (accumulator, activeLocale) => {
        const hasTitle = Boolean(
          item.translations[activeLocale.code as Locale]?.title,
        );

        accumulator[activeLocale.code] = hasStoredTranslations
          ? hasTitle
          : activeLocale.code === defaultLocale;

        return accumulator;
      },
      {},
    ),
  );
  const activeLocaleCount =
    Object.values(activeLocaleCodes).filter(Boolean).length;
  const handleToggleLocale = useCallback(
    (localeCode: Locale, isActiveLocale: boolean) => {
      setActiveLocaleCodes((current) => ({
        ...current,
        [localeCode]: isActiveLocale,
      }));
    },
    [],
  );
  const handlePendingChange = useCallback((key: string, isPending: boolean) => {
    setPendingUploads((current) => ({ ...current, [key]: isPending }));
  }, []);
  const hasPendingUploads = Object.values(pendingUploads).some(Boolean);
  const mediaType = getEntertainmentMediaType(selectedCategory);
  const storedAudioTracks =
    item.media.type === "video" && item.media.source?.kind === "hls"
      ? (item.media.source.audioTracks ?? [])
      : [];
  const storedSubtitleTracks =
    item.media.type === "video" ? (item.media.subtitleTracks ?? []) : [];
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
      case AdminEntertainmentFormErrorCode.AudioLanguageRequired:
        return tForm("errorMessages.audioLanguageRequired");
      case AdminEntertainmentFormErrorCode.AudioLanguageInvalid:
        return tForm("errorMessages.audioLanguageInvalid");
      case AdminEntertainmentFormErrorCode.AudioLanguageDuplicate:
        return tForm("errorMessages.audioLanguageDuplicate");
      case AdminEntertainmentFormErrorCode.AudioFileRequired:
        return tForm("errorMessages.audioFileRequired");
      case AdminEntertainmentFormErrorCode.SubtitleLanguageRequired:
        return tForm("errorMessages.subtitleLanguageRequired");
      case AdminEntertainmentFormErrorCode.SubtitleLanguageInvalid:
        return tForm("errorMessages.subtitleLanguageInvalid");
      case AdminEntertainmentFormErrorCode.SubtitleLanguageDuplicate:
        return tForm("errorMessages.subtitleLanguageDuplicate");
      case AdminEntertainmentFormErrorCode.SubtitleFileRequired:
        return tForm("errorMessages.subtitleFileRequired");
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
          onVideoFileChangeAction={setVideoFile}
          onPendingChangeAction={handlePendingChange}
        />

        {mediaType === "video" ? (
          <AdminEntertainmentAudioSection
            locale={locale}
            slug={item.slug || undefined}
            storedTracks={storedAudioTracks}
            onPendingChangeAction={handlePendingChange}
          />
        ) : null}

        {mediaType === "video" ? (
          <AdminEntertainmentSubtitleSection
            locale={locale}
            slug={item.slug || undefined}
            storedTracks={storedSubtitleTracks}
            onPendingChangeAction={handlePendingChange}
          />
        ) : null}

        {activeLocales.map((activeLocale) => {
          const localeCode = activeLocale.code as Locale;

          return (
            <AdminEntertainmentLocaleSection
              key={localeCode}
              locale={localeCode}
              label={getLocaleDisplayName(localeCode, locale)}
              isDefaultLocale={localeCode === defaultLocale}
              isActive={activeLocaleCodes[localeCode] ?? false}
              canToggle={
                !activeLocaleCodes[localeCode] || activeLocaleCount > 1
              }
              onToggleActiveAction={handleToggleLocale}
              slug={item.slug || undefined}
              videoFile={videoFile}
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
