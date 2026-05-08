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

import type { ProductImage } from "@/types/product-details";

import { ImageCard } from "../image-card";
import { SortableImageCard } from "../sortable-image-card";
import styles from "../styles.module.css";
import type {
  AdminImageUploadFieldProps,
  OrderedImageFieldEntry,
  OrderedImageFieldItem,
} from "../types";

const mapExistingImages = (existingImages: ProductImage[]): OrderedImageFieldItem[] =>
  existingImages.map((image) => ({
    id: image.id,
    kind: "existing",
    src: image.src,
    alt: image.alt ?? image.id,
    emoji: image.emoji,
    bgColor: image.bgColor,
    existingImage: image,
  }));

export const AdminImageUploadField = ({
  name,
  existingImagesInputName,
  imageOrderInputName,
  buttonLabel,
  helperText,
  removeButtonLabel,
  thumbnailLabel,
  galleryLabel,
  existingImages,
}: AdminImageUploadFieldProps) => {
  const [orderedImages, setOrderedImages] = useState<OrderedImageFieldItem[]>(() =>
    mapExistingImages(existingImages),
  );
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const orderedImagesRef = useRef<OrderedImageFieldItem[]>(orderedImages);
  const fileEntriesRef = useRef<Array<{ id: string; file: File }>>([]);
  const previewUrlsRef = useRef<string[]>([]);
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

  const syncInputFiles = (
    nextOrderedImages: OrderedImageFieldItem[],
    nextFileEntries: Array<{ id: string; file: File }>,
  ) => {
    if (!inputRef.current) {
      return;
    }

    const fileById = new Map(
      nextFileEntries.map((entry) => [entry.id, entry.file]),
    );
    const dataTransfer = new DataTransfer();

    nextOrderedImages
      .filter((image) => image.kind === "new")
      .forEach((image) => {
        const file = fileById.get(image.id);

        if (file) {
          dataTransfer.items.add(file);
        }
      });

    inputRef.current.files = dataTransfer.files;
  };

  const updateImagesState = (
    nextOrderedImages: OrderedImageFieldItem[],
    nextFileEntries: Array<{ id: string; file: File }>,
  ) => {
    orderedImagesRef.current = nextOrderedImages;
    fileEntriesRef.current = nextFileEntries;
    setOrderedImages(nextOrderedImages);
    syncInputFiles(nextOrderedImages, nextFileEntries);
  };

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

    const nextOrderedImages = arrayMove(currentImages, sourceIndex, targetIndex);
    updateImagesState(nextOrderedImages, fileEntriesRef.current);
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
    const imageToRemove = orderedImagesRef.current.find((image) => image.id === imageId);

    if (!imageToRemove) {
      return;
    }

    if (imageToRemove.kind === "new" && imageToRemove.src) {
      URL.revokeObjectURL(imageToRemove.src);
      previewUrlsRef.current = previewUrlsRef.current.filter((url) => url !== imageToRemove.src);
    }

    const nextOrderedImages = orderedImagesRef.current.filter((image) => image.id !== imageId);
    const nextFileEntries = fileEntriesRef.current.filter((entry) => entry.id !== imageId);

    if (activeImageId === imageId) {
      setActiveImageId(null);
    }

    updateImagesState(nextOrderedImages, nextFileEntries);
  };

  const existingImagesValue = JSON.stringify(
    orderedImages
      .filter((image) => image.kind === "existing")
      .map((image) => image.existingImage),
  );
  const imageOrderValue = JSON.stringify(
    orderedImages.map<OrderedImageFieldEntry>(({ id, kind }) => ({ id, kind })),
  );

  return (
    <Stack gap={1.5}>
      <input type="hidden" name={existingImagesInputName} value={existingImagesValue} />
      <input type="hidden" name={imageOrderInputName} value={imageOrderValue} />

      <Typography variant="body2" color="text.secondary">
        {helperText}
      </Typography>

      {orderedImages.length > 0 ? (
        <DndContext
          id={`${imageOrderInputName}-dnd-context`}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => {
            setActiveImageId(null);
          }}
        >
          <SortableContext items={orderedImages.map((image) => image.id)} strategy={rectSortingStrategy}>
            <Box className={styles.grid}>
              {orderedImages.map((image, index) => (
                <SortableImageCard
                  key={image.id}
                  image={image}
                  index={index}
                  thumbnailLabel={thumbnailLabel}
                  galleryLabel={galleryLabel}
                  removeButtonLabel={removeButtonLabel}
                  onRemove={() => {
                    removeImage(image.id);
                  }}
                />
              ))}
            </Box>
          </SortableContext>

          <DragOverlay>
            {activeImage ? (
              <Box className={styles.overlay}>
                <ImageCard
                  image={activeImage}
                  index={orderedImages.findIndex((image) => image.id === activeImage.id)}
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
          ref={inputRef}
          hidden
          type="file"
          name={name}
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

            const nextFileEntries = selectedFiles.map((file) => {
              const id = crypto.randomUUID();
              const previewUrl = URL.createObjectURL(file);

              previewUrlsRef.current.push(previewUrl);

              return {
                id,
                file,
                previewUrl,
              };
            });
            const nextOrderedImages = [
              ...orderedImagesRef.current,
              ...nextFileEntries.map<OrderedImageFieldItem>((entry) => ({
                id: entry.id,
                kind: "new",
                src: entry.previewUrl,
                alt: entry.file.name,
              })),
            ];

            updateImagesState(nextOrderedImages, [
              ...fileEntriesRef.current,
              ...nextFileEntries.map(({ id, file }) => ({ id, file })),
            ]);
          }}
        />
      </Button>
    </Stack>
  );
};