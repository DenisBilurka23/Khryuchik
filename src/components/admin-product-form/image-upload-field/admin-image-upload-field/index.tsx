"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Box, Button, Stack, Typography } from "@mui/material";

import { requestAdminProductGalleryUploadUrls } from "@/client-api/admin";

import {
  buildImagesJsonValue,
  getStatusLabel,
  mapExistingImages,
} from "../helpers";
import { ImageCard } from "../image-card";
import { SortableImageCard } from "../sortable-image-card";
import styles from "../styles.module.css";
import {
  uploadDirectToR2,
  useAdminProductUploadRegistry,
} from "../../upload-registry";
import type {
  AdminImageUploadFieldProps,
  ImageUploadStatus,
  OrderedImageFieldItem,
} from "../types";

export const AdminImageUploadField = ({
  imagesJsonInputName,
  locale,
  productId,
  buttonLabel,
  helperText,
  removeButtonLabel,
  thumbnailLabel,
  galleryLabel,
  existingImages,
  statusLabels,
}: AdminImageUploadFieldProps) => {
  const [orderedImages, setOrderedImages] = useState<OrderedImageFieldItem[]>(
    () => mapExistingImages(existingImages),
  );
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const orderedImagesRef = useRef<OrderedImageFieldItem[]>(orderedImages);
  const previewUrlsRef = useRef<string[]>([]);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);
  const { register } = useAdminProductUploadRegistry();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 1,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const revokePreviewUrls = useEffectEvent(() => {
    previewUrlsRef.current.forEach((url) => {
      URL.revokeObjectURL(url);
    });
  });

  const syncHiddenInput = (items: OrderedImageFieldItem[]) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.value = buildImagesJsonValue(items);
    }
  };

  const updateImagesState = (nextOrderedImages: OrderedImageFieldItem[]) => {
    orderedImagesRef.current = nextOrderedImages;
    setOrderedImages(nextOrderedImages);
    syncHiddenInput(nextOrderedImages);
  };

  const patchImageById = useEffectEvent(
    (imageId: string, patch: Partial<OrderedImageFieldItem>) => {
      const nextOrderedImages = orderedImagesRef.current.map((image) =>
        image.id === imageId ? { ...image, ...patch } : image,
      );

      updateImagesState(nextOrderedImages);
    },
  );

  useEffect(() => {
    return () => {
      revokePreviewUrls();
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("admin-image-dragging", Boolean(activeImageId));

    return () => {
      document.body.classList.remove("admin-image-dragging");
    };
  }, [activeImageId]);

  useEffect(() => {
    const runUploads = async () => {
      const pendingItems = orderedImagesRef.current.filter(
        (item) =>
          item.kind === "new" &&
          item.file &&
          (item.status === "pending" || item.status === "error"),
      );

      if (pendingItems.length === 0) {
        return;
      }

      pendingItems.forEach((item) => {
        patchImageById(item.id, {
          status: "uploading",
          progress: 0,
          errorMessage: undefined,
        });
      });

      const presignResponse = await requestAdminProductGalleryUploadUrls({
        locale,
        productId,
        files: pendingItems.map((item) => ({
          fileName: item.file!.name,
          contentType: item.file!.type || "application/octet-stream",
        })),
      });

      if (!presignResponse.ok || !presignResponse.data?.items) {
        pendingItems.forEach((item) => {
          patchImageById(item.id, { status: "error" });
        });

        throw new Error("Failed to obtain upload URLs");
      }

      const plans = presignResponse.data.items;

      await Promise.all(
        plans.map(async (plan, index) => {
          const item = pendingItems[index];

          if (!item?.file) {
            return;
          }

          try {
            await uploadDirectToR2({
              uploadUrl: plan.uploadUrl,
              file: item.file,
              contentType: plan.contentType,
              onProgress: (progress) => {
                patchImageById(item.id, { progress });
              },
            });

            patchImageById(item.id, {
              status: "uploaded",
              progress: 1,
              uploadedImage: plan.image,
            });
          } catch (uploadError) {
            patchImageById(item.id, {
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

  const moveImage = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) {
      return;
    }

    const currentImages = orderedImagesRef.current;
    const sourceIndex = currentImages.findIndex((image) => image.id === sourceId);
    const targetIndex = currentImages.findIndex((image) => image.id === targetId);

    if (sourceIndex < 0 || targetIndex < 0) {
      return;
    }

    updateImagesState(arrayMove(currentImages, sourceIndex, targetIndex));
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveImageId(String(active.id));
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over && active.id !== over.id) {
      moveImage(String(active.id), String(over.id));
    }

    setActiveImageId(null);
  };

  const activeImage = activeImageId
    ? orderedImages.find((image) => image.id === activeImageId) ?? null
    : null;

  const removeImage = (imageId: string) => {
    const imageToRemove = orderedImagesRef.current.find(
      (image) => image.id === imageId,
    );

    if (!imageToRemove) {
      return;
    }

    if (imageToRemove.kind === "new" && imageToRemove.src) {
      URL.revokeObjectURL(imageToRemove.src);
      previewUrlsRef.current = previewUrlsRef.current.filter(
        (url) => url !== imageToRemove.src,
      );
    }

    const nextOrderedImages = orderedImagesRef.current.filter(
      (image) => image.id !== imageId,
    );

    if (activeImageId === imageId) {
      setActiveImageId(null);
    }

    updateImagesState(nextOrderedImages);
  };

  return (
    <Stack gap={1.5}>
      <input
        ref={hiddenInputRef}
        type="hidden"
        name={imagesJsonInputName}
        defaultValue={buildImagesJsonValue(orderedImages)}
      />

      <Typography variant="body2" color="text.secondary">
        {helperText}
      </Typography>

      {orderedImages.length > 0 ? (
        <DndContext
          id={`${imagesJsonInputName}-dnd-context`}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => {
            setActiveImageId(null);
          }}
        >
          <SortableContext
            items={orderedImages.map((image) => image.id)}
            strategy={rectSortingStrategy}
          >
            <Box className={styles.grid}>
              {orderedImages.map((image, index) => {
                const status = getStatusLabel(image, statusLabels);

                return (
                  <SortableImageCard
                    key={image.id}
                    image={image}
                    index={index}
                    thumbnailLabel={thumbnailLabel}
                    galleryLabel={galleryLabel}
                    removeButtonLabel={removeButtonLabel}
                    statusLabel={status?.label}
                    statusTone={status?.tone}
                    onRemoveAction={() => {
                      removeImage(image.id);
                    }}
                  />
                );
              })}
            </Box>
          </SortableContext>

          <DragOverlay>
            {activeImage ? (
              <Box className={styles.overlay}>
                <ImageCard
                  image={activeImage}
                  index={orderedImages.findIndex(
                    (image) => image.id === activeImage.id,
                  )}
                  thumbnailLabel={thumbnailLabel}
                  galleryLabel={galleryLabel}
                  isDragging
                  isOverlay
                />
              </Box>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : null}

      <Button component="label" variant="outlined" sx={{ alignSelf: "flex-start" }}>
        {buttonLabel}
        <input
          hidden
          type="file"
          accept="image/*"
          multiple
          onClick={(event) => {
            event.currentTarget.value = "";
          }}
          onChange={(event) => {
            const selectedFiles = Array.from(event.target.files ?? []);

            if (selectedFiles.length === 0) {
              return;
            }

            const nextItems = selectedFiles.map<OrderedImageFieldItem>(
              (file) => {
                const id = crypto.randomUUID();
                const previewUrl = URL.createObjectURL(file);

                previewUrlsRef.current.push(previewUrl);

                return {
                  id,
                  kind: "new",
                  src: previewUrl,
                  alt: file.name,
                  file,
                  status: "pending" satisfies ImageUploadStatus,
                  progress: 0,
                };
              },
            );

            updateImagesState([...orderedImagesRef.current, ...nextItems]);
          }}
        />
      </Button>
    </Stack>
  );
};
