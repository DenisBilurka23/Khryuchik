"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { requestAdminProductAssetUploadUrls } from "@/client-api/admin";
import type { ProductFileAsset } from "@/types/product-details";

import {
  uploadDirectToR2,
  useAdminProductUploadRegistry,
} from "../upload-registry";
import type {
  AdminFileUploadFieldProps,
  AdminFileUploadItem,
  AdminFileUploadStatusLabels,
} from "./types";

const buildAssetsJson = (
  storedFiles: ProductFileAsset[],
  pendingItem: AdminFileUploadItem | null,
) =>
  JSON.stringify([
    ...storedFiles,
    ...(pendingItem?.uploadedAsset ? [pendingItem.uploadedAsset] : []),
  ]);

const formatStatus = (
  item: AdminFileUploadItem,
  labels: AdminFileUploadStatusLabels,
) => {
  switch (item.status) {
    case "uploading":
      return `${labels.uploading} ${Math.round(item.progress * 100)}%`;
    case "uploaded":
      return labels.uploaded;
    case "error":
      return labels.error;
    default:
      return "";
  }
};

export const AdminFileUploadField = ({
  assetsJsonInputName,
  locale,
  productId,
  buttonLabel,
  helperText,
  existingFiles,
  statusLabels,
}: AdminFileUploadFieldProps) => {
  const [storedFiles, setStoredFiles] =
    useState<ProductFileAsset[]>(existingFiles);
  const [pendingItem, setPendingItem] = useState<AdminFileUploadItem | null>(
    null,
  );
  const pendingRef = useRef<AdminFileUploadItem | null>(pendingItem);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const { register } = useAdminProductUploadRegistry();

  const syncHiddenInput = (
    nextStored: ProductFileAsset[],
    nextPending: AdminFileUploadItem | null,
  ) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = buildAssetsJson(nextStored, nextPending);
    }
  };

  const patchPending = useEffectEvent((patch: Partial<AdminFileUploadItem>) => {
    if (!pendingRef.current) return;
    const next = { ...pendingRef.current, ...patch };
    pendingRef.current = next;
    setPendingItem(next);
    syncHiddenInput(storedFiles, next);
  });

  useEffect(() => {
    const runUploads = async () => {
      const item = pendingRef.current;

      if (!item || (item.status !== "pending" && item.status !== "error")) {
        return;
      }

      patchPending({
        status: "uploading",
        progress: 0,
        errorMessage: undefined,
      });

      const presignResponse = await requestAdminProductAssetUploadUrls({
        locale,
        productId,
        files: [
          {
            fileName: item.file.name,
            contentType: item.file.type || "application/pdf",
          },
        ],
      });

      if (!presignResponse.ok || !presignResponse.data?.items?.[0]) {
        patchPending({ status: "error" });
        throw new Error("Failed to obtain asset upload URL");
      }

      const plan = presignResponse.data.items[0];

      try {
        await uploadDirectToR2({
          uploadUrl: plan.uploadUrl,
          file: item.file,
          contentType: plan.contentType,
          onProgress: (progress) => patchPending({ progress }),
        });

        patchPending({
          status: "uploaded",
          progress: 1,
          uploadedAsset: {
            id: plan.id,
            label: plan.fileName,
            fileName: plan.fileName,
            format: plan.format,
            contentType: plan.contentType,
            sizeBytes: item.file.size,
            objectKey: plan.objectKey,
          },
        });
      } catch (err) {
        patchPending({
          status: "error",
          errorMessage: err instanceof Error ? err.message : "upload_failed",
        });
        throw err;
      }
    };

    return register(runUploads);
  }, [locale, productId, register]);

  const handleFileSelect = (file: File) => {
    const newItem: AdminFileUploadItem = {
      id: crypto.randomUUID(),
      file,
      status: "pending",
      progress: 0,
    };
    setStoredFiles([]);
    pendingRef.current = newItem;
    setPendingItem(newItem);
    syncHiddenInput([], newItem);
  };

  const handleDeleteStored = (fileId: string) => {
    const next = storedFiles.filter((f) => f.id !== fileId);
    setStoredFiles(next);
    syncHiddenInput(next, pendingItem);
  };

  const handleDeletePending = () => {
    pendingRef.current = null;
    setPendingItem(null);
    syncHiddenInput(storedFiles, null);
  };

  const currentFile: { name: string; meta: string } | null = (() => {
    if (pendingItem) {
      const statusText = formatStatus(pendingItem, statusLabels);
      return { name: pendingItem.file.name, meta: statusText };
    }
    if (storedFiles.length > 0) {
      const f = storedFiles[0];
      return { name: f.label, meta: `${f.format.toUpperCase()}` };
    }
    return null;
  })();

  return (
    <Stack gap={1.5}>
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={assetsJsonInputName}
        defaultValue={buildAssetsJson(storedFiles, pendingItem)}
      />

      <Typography variant="body2" color="text.secondary">
        {helperText}
      </Typography>

      {currentFile ? (
        <Paper variant="outlined" sx={{ p: 1.5, borderRadius: "16px" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <InsertDriveFileOutlinedIcon
              fontSize="small"
              sx={{ color: "text.secondary", flexShrink: 0 }}
            />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                fontWeight={600}
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {currentFile.name}
              </Typography>
              {currentFile.meta ? (
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      pendingItem?.status === "error"
                        ? "error.main"
                        : pendingItem?.status === "uploaded"
                          ? "#1F8A4C"
                          : "text.secondary",
                  }}
                >
                  {currentFile.meta}
                </Typography>
              ) : null}
            </Box>
            <Tooltip title="Remove file">
              <IconButton
                size="small"
                onClick={
                  pendingItem
                    ? handleDeletePending
                    : () => handleDeleteStored(storedFiles[0].id)
                }
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>
      ) : null}

      <Button
        component="label"
        variant="outlined"
        sx={{ alignSelf: "flex-start" }}
      >
        {buttonLabel}
        <input
          hidden
          type="file"
          accept=".pdf,application/pdf"
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />
      </Button>
    </Stack>
  );
};

export type { AdminFileUploadFieldProps } from "./types";
