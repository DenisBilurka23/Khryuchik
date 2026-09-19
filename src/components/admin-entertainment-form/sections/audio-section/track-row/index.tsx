"use client";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  ENTERTAINMENT_AUDIO_CONTENT_TYPES,
  ENTERTAINMENT_AUDIO_MAX_BYTES,
} from "@/constants/entertainment";
import { formatFileSize } from "@/utils";
import { getAdminEntertainmentStatusTone } from "@/utils/admin";

import {
  AdminLanguageSelectField,
  AdminStatusChip,
} from "@/components/admin-page-shared";
import { AdminEntertainmentUploadField } from "../../../upload-field";
import type { AdminEntertainmentAudioTrackRowProps } from "./types";

const rowSx = {
  p: { xs: 1.5, md: 2 },
  borderRadius: "20px",
  border: "1px solid #F0DFC8",
} as const;

export const AdminEntertainmentAudioTrackRow = ({
  row,
  locale,
  slug,
  takenLanguages,
  onLanguageChangeAction,
  onUploadedAction,
  onRemoveAction,
  onPendingChangeAction,
}: AdminEntertainmentAudioTrackRowProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const storedLabel = row.hasStoredSource
    ? tForm("audio.storedSource")
    : undefined;

  return (
    <Stack gap={1.5} sx={rowSx}>
      <Stack direction="row" gap={1.5} alignItems="flex-start">
        <Stack sx={{ flex: 1 }}>
          <AdminLanguageSelectField
            name={`audioLanguage.${row.key}`}
            label={
              row.isDefault
                ? tForm("audio.masterLanguage")
                : tForm("audio.dubLanguage")
            }
            locale={locale}
            defaultValue={row.language || undefined}
            excludeCodes={takenLanguages}
            required
            placeholder={tForm("audio.languagePlaceholder")}
            noOptionsText={tForm("audio.languageNoOptions")}
            onValueChangeAction={(code) =>
              onLanguageChangeAction(row.key, code ?? "")
            }
          />
        </Stack>

        {row.storedStatus ? (
          <AdminStatusChip
            label={tForm(`videoStatus.${row.storedStatus}`)}
            tone={getAdminEntertainmentStatusTone(row.storedStatus)}
          />
        ) : null}

        {row.isDefault ? null : (
          <Tooltip title={tForm("audio.removeTrack")}>
            <IconButton
              aria-label={tForm("audio.removeTrack")}
              onClick={() => onRemoveAction(row.key)}
            >
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      {row.isDefault ? null : (
        <AdminEntertainmentUploadField
          pendingKey={`audio:${row.key}`}
          kind="audio"
          accept={ENTERTAINMENT_AUDIO_CONTENT_TYPES.join(",")}
          contentTypes={ENTERTAINMENT_AUDIO_CONTENT_TYPES}
          maxBytes={ENTERTAINMENT_AUDIO_MAX_BYTES}
          dropLabel={tForm("audio.dropLabel")}
          dropHint={`${tForm("audio.dropHint")} · ${formatFileSize(ENTERTAINMENT_AUDIO_MAX_BYTES)}`}
          slug={slug}
          currentLabel={row.uploadedFile?.fileName ?? storedLabel}
          currentMeta={
            row.uploadedFile
              ? formatFileSize(row.uploadedFile.sizeBytes)
              : undefined
          }
          onUploadedAction={(uploadedFile) =>
            onUploadedAction(row.key, uploadedFile)
          }
          onPendingChangeAction={onPendingChangeAction}
        />
      )}
    </Stack>
  );
};

export type { AdminEntertainmentAudioTrackRowProps } from "./types";
