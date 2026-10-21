"use client";

import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { JETPRINT_UPLOAD_ACCEPT } from "@/constants/jetprint";

import type { JetprintFileUploadItem } from "../hooks/useJetprintFileUploads.types";
import { getJetprintFileStatusColor } from "../utils";
import type { AdminJetprintFilesFieldProps } from "./types";

const fileNameSx = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
} as const;

export const AdminJetprintFilesField = ({
  name,
  title,
  helperText,
  inputRef,
  uploads,
  actions,
}: AdminJetprintFilesFieldProps) => {
  const tJetprint = useTranslations("adminPage.productForm.jetprint");
  const { stored, pending, value, addFiles, removeStored, removePending } =
    uploads;

  const describeStatus = (item: JetprintFileUploadItem) =>
    item.status === "uploading"
      ? `${tJetprint("fileStatus.uploading")} ${Math.round(item.progress * 100)}%`
      : tJetprint(`fileStatus.${item.status}`);

  const rows = [
    ...stored.map((file) => ({
      key: file.url,
      label: file.name || file.url,
      meta: undefined,
      color: "text.secondary",
      onRemove: () => removeStored(file.url),
    })),
    ...pending.map((item) => ({
      key: item.id,
      label: item.file.name,
      meta: describeStatus(item),
      color: getJetprintFileStatusColor(item.status),
      onRemove: () => removePending(item.id),
    })),
  ];

  return (
    <Stack gap={1.5}>
      <input ref={inputRef} type="hidden" name={name} defaultValue={value} />

      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {helperText}
        </Typography>
      </Box>

      {rows.map((row) => (
        <Paper
          key={row.key}
          variant="outlined"
          sx={{ p: 1.5, borderRadius: "16px" }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <ImageOutlinedIcon
              fontSize="small"
              sx={{ color: "text.secondary", flexShrink: 0 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography fontWeight={600} sx={fileNameSx}>
                {row.label}
              </Typography>
              {row.meta ? (
                <Typography variant="caption" sx={{ color: row.color }}>
                  {row.meta}
                </Typography>
              ) : null}
            </Box>
            <Tooltip title={tJetprint("removeFile")}>
              <IconButton
                size="small"
                aria-label={tJetprint("removeFile")}
                onClick={row.onRemove}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      ))}

      <Stack direction="row" gap={1} flexWrap="wrap">
        <Button component="label" variant="outlined">
          {tJetprint("uploadButton")}
          <input
            hidden
            multiple
            type="file"
            accept={JETPRINT_UPLOAD_ACCEPT}
            onClick={(event) => {
              event.currentTarget.value = "";
            }}
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);

              if (files.length > 0) {
                addFiles(files);
              }
            }}
          />
        </Button>
        {actions}
      </Stack>
    </Stack>
  );
};

export type { AdminJetprintFilesFieldProps } from "./types";
