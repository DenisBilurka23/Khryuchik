"use client";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { AdminDropZone } from "@/components/admin-page-shared";
import { useAdminEntertainmentUpload } from "@/hooks/useAdminEntertainmentUpload";

import type { AdminEntertainmentUploadFieldProps } from "./types";

const previewSx = {
  width: 72,
  height: 72,
  flexShrink: 0,
  objectFit: "cover",
  borderRadius: "16px",
  border: "1px solid #F0DFC8",
} as const;

const fileNameSx = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

export const AdminEntertainmentUploadField = ({
  pendingKey,
  kind,
  accept,
  contentTypes,
  maxBytes,
  dropLabel,
  dropHint,
  slug,
  locale,
  currentLabel,
  currentMeta,
  previewUrl,
  onUploadedAction,
  onRemoveAction,
  onPendingChangeAction,
}: AdminEntertainmentUploadFieldProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const { state, upload, reset } = useAdminEntertainmentUpload({
    kind,
    contentTypes,
    maxBytes,
    slug,
    locale,
  });
  const isUploading = state.status === "uploading";
  const errorMessage = state.errorCode
    ? tForm(`uploadErrors.${state.errorCode}`)
    : undefined;

  const handleFiles = async (files: File[]) => {
    const file = files[0];

    if (!file) {
      return;
    }

    onPendingChangeAction(pendingKey, true);

    const uploadedFile = await upload(file);

    onPendingChangeAction(pendingKey, false);

    if (uploadedFile) {
      onUploadedAction(uploadedFile, file);
    }
  };

  const handleRemove = () => {
    reset();
    onRemoveAction?.();
  };

  return (
    <Stack gap={1.5}>
      {currentLabel ? (
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: "16px" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {previewUrl ? (
              <Box
                component="img"
                src={previewUrl}
                alt={currentLabel}
                sx={previewSx}
              />
            ) : (
              <InsertDriveFileOutlinedIcon
                fontSize="small"
                sx={{ color: "text.secondary", flexShrink: 0 }}
              />
            )}

            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography fontWeight={600} sx={fileNameSx}>
                {currentLabel}
              </Typography>
              {currentMeta ? (
                <Typography variant="caption" color="text.secondary">
                  {currentMeta}
                </Typography>
              ) : null}
            </Box>

            {onRemoveAction ? (
              <Tooltip title={tForm("buttons.removeFile")}>
                <IconButton
                  size="small"
                  onClick={handleRemove}
                  aria-label={tForm("buttons.removeFile")}
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : null}
          </Stack>
        </Paper>
      ) : null}

      {isUploading ? (
        <Stack gap={0.75}>
          <Typography variant="body2" color="text.secondary">
            {`${tForm("uploadStatus.uploading")} ${Math.round(state.progress * 100)}% — ${state.fileName ?? ""}`}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={Math.round(state.progress * 100)}
            sx={{ borderRadius: "999px", height: 8 }}
          />
        </Stack>
      ) : (
        <AdminDropZone
          label={currentLabel ? tForm("buttons.replaceFile") : dropLabel}
          hint={dropHint}
          accept={accept}
          onFilesAction={handleFiles}
        />
      )}

      {errorMessage ? (
        <Typography variant="body2" color="error.main">
          {errorMessage}
        </Typography>
      ) : null}
    </Stack>
  );
};

export type { AdminEntertainmentUploadFieldProps } from "./types";
