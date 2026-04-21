"use client";

import { useState } from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";

import type { AdminFileUploadFieldProps } from "./types";

export const AdminFileUploadField = ({
  name,
  buttonLabel,
  helperText,
  existingFiles,
}: AdminFileUploadFieldProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  return (
    <Stack gap={1.5}>
      <Typography variant="body2" color="text.secondary">
        {helperText}
      </Typography>

      {existingFiles.length > 0 ? (
        <Stack gap={1}>
          {existingFiles.map((file) => (
            <Paper key={file.id} variant="outlined" sx={{ p: 1.5, borderRadius: "16px" }}>
              <Typography fontWeight={600}>{file.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {file.fileName} · {file.format}
              </Typography>
            </Paper>
          ))}
        </Stack>
      ) : null}

      {selectedFiles.length > 0 ? (
        <Stack gap={0.75}>
          {selectedFiles.map((file) => (
            <Typography key={`${file.name}-${file.size}`} variant="body2">
              {file.name}
            </Typography>
          ))}
        </Stack>
      ) : null}

      <Button component="label" variant="outlined" sx={{ alignSelf: "flex-start" }}>
        {buttonLabel}
        <input
          hidden
          type="file"
          name={name}
          accept=".pdf,application/pdf"
          multiple
          onChange={(event) => {
            setSelectedFiles(Array.from(event.target.files ?? []));
          }}
        />
      </Button>
    </Stack>
  );
};

export type { AdminFileUploadFieldProps } from "./types";