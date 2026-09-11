"use client";

import { useState } from "react";
import { Alert, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import {
  ENTERTAINMENT_DOWNLOAD_CONTENT_TYPES,
  ENTERTAINMENT_DOWNLOAD_MAX_BYTES,
  ENTERTAINMENT_VIDEO_CONTENT_TYPES,
  ENTERTAINMENT_VIDEO_MAX_BYTES,
} from "@/constants/entertainment";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import { formatFileSize } from "@/utils";
import { getAdminEntertainmentStatusTone } from "@/utils/admin";

import { AdminSectionCard, AdminStatusChip } from "../../../admin-page-shared";
import { AdminEntertainmentUploadField } from "../../upload-field";
import {
  getEntertainmentMediaFileName,
  readVideoDurationSeconds,
} from "../../utils";
import type { AdminEntertainmentMediaSectionProps } from "./types";

export const AdminEntertainmentMediaSection = ({
  item,
  mediaType,
  onPendingChangeAction,
}: AdminEntertainmentMediaSectionProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const [uploadedFile, setUploadedFile] =
    useState<AdminEntertainmentUploadedFile | null>(null);
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const isVideo = mediaType === "video";
  const storedFileName =
    item.media.type === mediaType
      ? getEntertainmentMediaFileName(item.media)
      : undefined;
  const storedMeta =
    item.media.type === "download" && mediaType === "download"
      ? formatFileSize(item.media.sizeBytes)
      : undefined;
  const videoStatus = item.media.type === "video" ? item.media.status : null;
  const maxBytes = isVideo
    ? ENTERTAINMENT_VIDEO_MAX_BYTES
    : ENTERTAINMENT_DOWNLOAD_MAX_BYTES;

  const handleUploaded = async (
    file: AdminEntertainmentUploadedFile,
    sourceFile: File,
  ) => {
    setUploadedFile(file);

    if (isVideo) {
      setDurationSeconds(await readVideoDurationSeconds(sourceFile));
    }
  };

  const handleRemoveUploaded = () => {
    setUploadedFile(null);
    setDurationSeconds(null);
  };

  return (
    <AdminSectionCard
      title={isVideo ? tForm("videoSectionTitle") : tForm("fileSectionTitle")}
      description={
        isVideo
          ? tForm("videoSectionDescription")
          : tForm("fileSectionDescription")
      }
      action={
        videoStatus && isVideo ? (
          <AdminStatusChip
            label={tForm(`videoStatus.${videoStatus}`)}
            tone={getAdminEntertainmentStatusTone(videoStatus)}
          />
        ) : undefined
      }
    >
      <Stack gap={2}>
        <input type="hidden" name="mediaType" value={mediaType} />
        <input
          type="hidden"
          name="mediaFileJson"
          value={uploadedFile ? JSON.stringify(uploadedFile) : ""}
        />
        {durationSeconds === null ? null : (
          <input
            type="hidden"
            name="durationSeconds"
            value={String(durationSeconds)}
          />
        )}

        <AdminEntertainmentUploadField
          pendingKey="media"
          kind={isVideo ? "video" : "download"}
          accept={
            isVideo
              ? ENTERTAINMENT_VIDEO_CONTENT_TYPES.join(",")
              : ENTERTAINMENT_DOWNLOAD_CONTENT_TYPES.join(",")
          }
          contentTypes={
            isVideo
              ? ENTERTAINMENT_VIDEO_CONTENT_TYPES
              : ENTERTAINMENT_DOWNLOAD_CONTENT_TYPES
          }
          maxBytes={maxBytes}
          dropLabel={isVideo ? tForm("videoDropLabel") : tForm("fileDropLabel")}
          dropHint={`${isVideo ? tForm("videoDropHint") : tForm("fileDropHint")} · ${formatFileSize(maxBytes)}`}
          slug={item.slug || undefined}
          currentLabel={uploadedFile?.fileName ?? storedFileName}
          currentMeta={
            uploadedFile ? formatFileSize(uploadedFile.sizeBytes) : storedMeta
          }
          onUploadedAction={handleUploaded}
          onRemoveAction={uploadedFile ? handleRemoveUploaded : undefined}
          onPendingChangeAction={onPendingChangeAction}
        />

        {isVideo && uploadedFile ? (
          <Alert severity="info">{tForm("videoProcessingNote")}</Alert>
        ) : null}
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminEntertainmentMediaSectionProps } from "./types";
