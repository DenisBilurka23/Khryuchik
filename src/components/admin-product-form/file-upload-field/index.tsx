"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

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

const buildAssetsJsonValue = (
  existingFiles: ProductFileAsset[],
  items: AdminFileUploadItem[],
) =>
  JSON.stringify([
    ...existingFiles,
    ...items
      .map((item) => item.uploadedAsset)
      .filter((asset): asset is ProductFileAsset => Boolean(asset)),
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
    case "pending":
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
  const [items, setItems] = useState<AdminFileUploadItem[]>([]);
  const itemsRef = useRef<AdminFileUploadItem[]>(items);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const { register } = useAdminProductUploadRegistry();

  const syncHiddenInput = (nextItems: AdminFileUploadItem[]) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = buildAssetsJsonValue(
        existingFiles,
        nextItems,
      );
    }
  };

  const updateItems = (nextItems: AdminFileUploadItem[]) => {
    itemsRef.current = nextItems;
    setItems(nextItems);
    syncHiddenInput(nextItems);
  };

  const patchItem = useEffectEvent(
    (itemId: string, patch: Partial<AdminFileUploadItem>) => {
      const next = itemsRef.current.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      );

      updateItems(next);
    },
  );

  useEffect(() => {
    const runUploads = async () => {
      const pendingItems = itemsRef.current.filter(
        (item) => item.status === "pending" || item.status === "error",
      );

      if (pendingItems.length === 0) {
        return;
      }

      pendingItems.forEach((item) => {
        patchItem(item.id, {
          status: "uploading",
          progress: 0,
          errorMessage: undefined,
        });
      });

      const presignResponse = await requestAdminProductAssetUploadUrls({
        locale,
        productId,
        files: pendingItems.map((item) => ({
          fileName: item.file.name,
          contentType: item.file.type || "application/pdf",
        })),
      });

      if (!presignResponse.ok || !presignResponse.data?.items) {
        pendingItems.forEach((item) => {
          patchItem(item.id, { status: "error" });
        });

        throw new Error("Failed to obtain asset upload URLs");
      }

      const plans = presignResponse.data.items;

      await Promise.all(
        plans.map(async (plan, index) => {
          const item = pendingItems[index];

          if (!item) {
            return;
          }

          try {
            await uploadDirectToR2({
              uploadUrl: plan.uploadUrl,
              file: item.file,
              contentType: plan.contentType,
              onProgress: (progress) => {
                patchItem(item.id, { progress });
              },
            });

            const uploadedAsset: ProductFileAsset = {
              id: plan.id,
              label: plan.fileName,
              fileName: plan.fileName,
              format: plan.format,
              contentType: plan.contentType,
              sizeBytes: item.file.size,
              objectKey: plan.objectKey,
            };

            patchItem(item.id, {
              status: "uploaded",
              progress: 1,
              uploadedAsset,
            });
          } catch (uploadError) {
            patchItem(item.id, {
              status: "error",
              errorMessage:
                uploadError instanceof Error
                  ? uploadError.message
                  : "upload_failed",
            });
            throw uploadError;
          }
        }),
      );
    };

    return register(runUploads);
  }, [locale, productId, register]);

  return (
    <Stack gap={1.5}>
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={assetsJsonInputName}
        defaultValue={buildAssetsJsonValue(existingFiles, items)}
      />

      <Typography variant="body2" color="text.secondary">
        {helperText}
      </Typography>

      {existingFiles.length > 0 ? (
        <Stack gap={1}>
          {existingFiles.map((file) => (
            <Paper
              key={file.id}
              variant="outlined"
              sx={{ p: 1.5, borderRadius: "16px" }}
            >
              <Typography fontWeight={600}>{file.label}</Typography>
              <Typography variant="body2" color="text.secondary">
                {file.fileName} · {file.format}
              </Typography>
            </Paper>
          ))}
        </Stack>
      ) : null}

      {items.length > 0 ? (
        <Stack gap={0.75}>
          {items.map((item) => {
            const statusText = formatStatus(item, statusLabels);

            return (
              <Box key={item.id}>
                <Typography variant="body2">{item.file.name}</Typography>
                {statusText ? (
                  <Typography
                    variant="caption"
                    sx={{
                      color:
                        item.status === "error"
                          ? "error.main"
                          : item.status === "uploaded"
                            ? "#1F8A4C"
                            : "#1F2937",
                    }}
                  >
                    {statusText}
                  </Typography>
                ) : null}
              </Box>
            );
          })}
        </Stack>
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
          multiple
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          onChange={(event) => {
            const selectedFiles = Array.from(event.target.files ?? []);

            if (selectedFiles.length === 0) {
              return;
            }

            const nextItems = selectedFiles.map<AdminFileUploadItem>(
              (file) => ({
                id: crypto.randomUUID(),
                file,
                status: "pending",
                progress: 0,
              }),
            );

            updateItems([...itemsRef.current, ...nextItems]);
          }}
        />
      </Button>
    </Stack>
  );
};

export type { AdminFileUploadFieldProps } from "./types";
