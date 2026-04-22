"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box } from "@mui/material";

import { ImageCard } from "../image-card";
import type { ImageCardProps } from "../types";

export const SortableImageCard = ({
  image,
  index,
  thumbnailLabel,
  galleryLabel,
  removeButtonLabel,
  onRemove,
}: ImageCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  return (
    <Box
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : undefined,
      }}
      sx={{ transformOrigin: "center center" }}
    >
      <ImageCard
        image={image}
        index={index}
        thumbnailLabel={thumbnailLabel}
        galleryLabel={galleryLabel}
        removeButtonLabel={removeButtonLabel}
        onRemove={onRemove}
        isDragging={isDragging}
        dragHandleAttributes={attributes}
        dragHandleListeners={listeners}
      />
    </Box>
  );
};