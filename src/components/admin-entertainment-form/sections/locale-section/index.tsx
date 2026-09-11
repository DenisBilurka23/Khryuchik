"use client";

import { useState } from "react";
import { Stack, TextField } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  ENTERTAINMENT_POSTER_CONTENT_TYPES,
  ENTERTAINMENT_POSTER_MAX_BYTES,
} from "@/constants/entertainment";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import type { ProductImage } from "@/types/product-details";

import { AdminSectionCard } from "../../../admin-page-shared";
import { AdminEntertainmentUploadField } from "../../upload-field";
import type { AdminEntertainmentLocaleSectionProps } from "./types";

export const AdminEntertainmentLocaleSection = ({
  locale,
  label,
  isDefaultLocale,
  slug,
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
    >
      <Stack gap={2.5}>
        <TextField
          label={tForm("fields.title")}
          name={`${locale}.title`}
          defaultValue={translation?.title ?? ""}
          required={isDefaultLocale}
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
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminEntertainmentLocaleSectionProps } from "./types";
