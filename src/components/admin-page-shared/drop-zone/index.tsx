"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Box, Stack, Typography } from "@mui/material";

import type { AdminDropZoneProps } from "./types";

const zoneSx = {
  display: "block",
  p: { xs: 2.5, md: 3.5 },
  borderRadius: "22px",
  border: "2px dashed #F0DFC8",
  bgcolor: "#FFFCF7",
  textAlign: "center",
  cursor: "pointer",
  transition: "border-color 0.2s ease, background-color 0.2s ease",
  "&:hover": { borderColor: "#F3B7C3" },
  "&:focus-visible": { outline: "2px solid #D96583", outlineOffset: 2 },
} as const;

const activeZoneSx = {
  borderColor: "#D96583",
  bgcolor: "#FCE7EF",
} as const;

const disabledZoneSx = {
  opacity: 0.6,
  cursor: "not-allowed",
  "&:hover": { borderColor: "#F0DFC8" },
} as const;

export const AdminDropZone = ({
  label,
  hint,
  accept,
  onFilesAction,
  multiple = false,
  disabled = false,
  icon,
}: AdminDropZoneProps) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const emitFiles = (fileList: FileList | null) => {
    const files = Array.from(fileList ?? []);

    if (files.length === 0) {
      return;
    }

    onFilesAction(multiple ? files : files.slice(0, 1));
  };

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();

    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDragActive(false);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragActive(false);

    if (disabled) {
      return;
    }

    emitFiles(event.dataTransfer.files);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    inputRef.current?.click();
  };

  return (
    <Box
      component="label"
      tabIndex={disabled ? -1 : 0}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      sx={{
        ...zoneSx,
        ...(isDragActive ? activeZoneSx : null),
        ...(disabled ? disabledZoneSx : null),
      }}
    >
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onClick={(event) => {
          event.currentTarget.value = "";
        }}
        onChange={(event) => emitFiles(event.target.files)}
      />

      <Stack alignItems="center" gap={0.75}>
        <Box sx={{ color: "#D96583", display: "flex" }}>
          {icon ?? <CloudUploadOutlinedIcon fontSize="large" />}
        </Box>
        <Typography fontWeight={700}>{label}</Typography>
        <Typography variant="body2" color="text.secondary">
          {hint}
        </Typography>
      </Stack>
    </Box>
  );
};

export type { AdminDropZoneProps } from "./types";
