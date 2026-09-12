"use client";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Checkbox, IconButton, Stack, Tooltip } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  ENTERTAINMENT_SUBTITLE_CONTENT_TYPES,
  ENTERTAINMENT_SUBTITLE_MAX_BYTES,
} from "@/constants/entertainment";
import { formatFileSize } from "@/utils";

import {
  AdminCheckboxField,
  AdminLanguageSelectField,
  AdminStatusChip,
} from "../../../../admin-page-shared";
import { AdminEntertainmentUploadField } from "../../../upload-field";
import type { AdminEntertainmentSubtitleTrackRowProps } from "./types";

const rowSx = {
  p: { xs: 1.5, md: 2 },
  borderRadius: "20px",
  border: "1px solid #F0DFC8",
} as const;

export const AdminEntertainmentSubtitleTrackRow = ({
  row,
  locale,
  slug,
  takenLanguages,
  onLanguageChangeAction,
  onPublishedChangeAction,
  onUploadedAction,
  onRemoveAction,
  onPendingChangeAction,
}: AdminEntertainmentSubtitleTrackRowProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const storedLabel = row.hasStoredFile
    ? tForm("subtitles.storedFile")
    : undefined;

  return (
    <Stack gap={1.5} sx={rowSx}>
      <Stack direction="row" gap={1.5} alignItems="flex-start">
        <Stack sx={{ flex: 1 }}>
          <AdminLanguageSelectField
            name={`subtitleLanguage.${row.key}`}
            label={tForm("subtitles.language")}
            locale={locale}
            defaultValue={row.language || undefined}
            excludeCodes={takenLanguages}
            required
            placeholder={tForm("subtitles.languagePlaceholder")}
            noOptionsText={tForm("subtitles.languageNoOptions")}
            onValueChangeAction={(code) =>
              onLanguageChangeAction(row.key, code ?? "")
            }
          />
        </Stack>

        {row.storedSource === "generated" ? (
          <AdminStatusChip
            label={tForm("subtitles.generated")}
            tone="neutral"
          />
        ) : null}

        <Tooltip title={tForm("subtitles.removeTrack")}>
          <IconButton
            aria-label={tForm("subtitles.removeTrack")}
            onClick={() => onRemoveAction(row.key)}
          >
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <AdminEntertainmentUploadField
        pendingKey={`subtitle:${row.key}`}
        kind="subtitle"
        accept=".vtt,text/vtt"
        contentTypes={ENTERTAINMENT_SUBTITLE_CONTENT_TYPES}
        fallbackContentType="text/vtt"
        maxBytes={ENTERTAINMENT_SUBTITLE_MAX_BYTES}
        dropLabel={tForm("subtitles.dropLabel")}
        dropHint={`${tForm("subtitles.dropHint")} · ${formatFileSize(ENTERTAINMENT_SUBTITLE_MAX_BYTES)}`}
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

      <AdminCheckboxField
        control={
          <Checkbox
            checked={row.isPublished}
            onChange={(event) =>
              onPublishedChangeAction(row.key, event.target.checked)
            }
          />
        }
        label={tForm("subtitles.isPublished")}
      />
    </Stack>
  );
};

export type { AdminEntertainmentSubtitleTrackRowProps } from "./types";
