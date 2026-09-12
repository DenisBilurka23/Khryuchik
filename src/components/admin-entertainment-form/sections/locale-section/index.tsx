"use client";

import { useState } from "react";
import {
  Collapse,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { useTranslations } from "next-intl";

import {
  ENTERTAINMENT_POSTER_CONTENT_TYPES,
  ENTERTAINMENT_POSTER_MAX_BYTES,
} from "@/constants/entertainment";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import type { ProductImage } from "@/types/product-details";

import { AdminSectionCard } from "../../../admin-page-shared";
import { AdminEntertainmentPosterFramePicker } from "../../poster-frame-picker";
import { AdminEntertainmentUploadField } from "../../upload-field";
import type { AdminEntertainmentLocaleSectionProps } from "./types";

export const AdminEntertainmentLocaleSection = ({
  locale,
  label,
  isDefaultLocale,
  isActive,
  canToggle,
  onToggleActiveAction,
  slug,
  videoFile,
  translation,
  onPendingChangeAction,
}: AdminEntertainmentLocaleSectionProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const [poster, setPoster] = useState<ProductImage | undefined>(
    translation?.poster,
  );

  const handleUploaded = (uploadedFile: AdminEntertainmentUploadedFile) => {
    setPoster({
      id: crypto.randomUUID(),
      src: uploadedFile.url,
      objectKey: uploadedFile.objectKey,
      alt: uploadedFile.fileName,
    });
  };

  return (
    <AdminSectionCard
      title={`${label} — ${tForm("localeSectionTitle")}`}
      description={
        isDefaultLocale
          ? tForm("localeSectionDefaultDescription")
          : tForm("localeSectionDescription")
      }
      action={
        <FormControlLabel
          sx={{ mr: 0 }}
          control={
            <Switch
              checked={isActive}
              onChange={(_event, checked) =>
                onToggleActiveAction(locale, checked)
              }
              disabled={!canToggle}
            />
          }
          label={tForm("localeActiveToggle")}
        />
      }
    >
      <Collapse in={isActive} unmountOnExit>
        <Stack gap={2.5}>
          <TextField
            label={tForm("fields.title")}
            name={`${locale}.title`}
            defaultValue={translation?.title ?? ""}
            required
            helperText={
              isDefaultLocale
                ? tForm("helpers.defaultTitle")
                : tForm("helpers.title")
            }
          />

          <TextField
            label={tForm("fields.description")}
            name={`${locale}.description`}
            defaultValue={translation?.description ?? ""}
            multiline
            minRows={3}
          />

          <input
            type="hidden"
            name={`${locale}.posterJson`}
            value={poster ? JSON.stringify(poster) : ""}
          />

          <AdminEntertainmentUploadField
            pendingKey={`poster:${locale}`}
            kind="poster"
            accept={ENTERTAINMENT_POSTER_CONTENT_TYPES.join(",")}
            contentTypes={ENTERTAINMENT_POSTER_CONTENT_TYPES}
            maxBytes={ENTERTAINMENT_POSTER_MAX_BYTES}
            dropLabel={tForm("posterDropLabel")}
            dropHint={tForm("posterDropHint")}
            slug={slug}
            locale={locale}
            currentLabel={poster?.alt}
            previewUrl={poster?.src}
            onUploadedAction={handleUploaded}
            onRemoveAction={() => setPoster(undefined)}
            onPendingChangeAction={onPendingChangeAction}
          />

          {videoFile ? (
            <AdminEntertainmentPosterFramePicker
              videoFile={videoFile}
              locale={locale}
              slug={slug}
              onUploadedAction={handleUploaded}
              onPendingChangeAction={onPendingChangeAction}
            />
          ) : null}
        </Stack>
      </Collapse>
    </AdminSectionCard>
  );
};

export type { AdminEntertainmentLocaleSectionProps } from "./types";
