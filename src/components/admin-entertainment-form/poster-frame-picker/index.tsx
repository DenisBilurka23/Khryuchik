"use client";

import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  ENTERTAINMENT_POSTER_CONTENT_TYPES,
  ENTERTAINMENT_POSTER_MAX_BYTES,
} from "@/constants/entertainment";
import { useAdminEntertainmentUpload } from "@/hooks/useAdminEntertainmentUpload";

import { captureVideoFrame } from "../utils";
import type { AdminEntertainmentPosterFramePickerProps } from "./types";

const videoSx = {
  width: "100%",
  maxHeight: "60vh",
  borderRadius: "16px",
  background: "#000000",
} as const;

export const AdminEntertainmentPosterFramePicker = ({
  videoFile,
  locale,
  slug,
  onUploadedAction,
  onPendingChangeAction,
}: AdminEntertainmentPosterFramePickerProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const [isOpen, setIsOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const objectUrl = useMemo(
    () => (isOpen ? URL.createObjectURL(videoFile) : undefined),
    [isOpen, videoFile],
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { upload } = useAdminEntertainmentUpload({
    kind: "poster",
    contentTypes: ENTERTAINMENT_POSTER_CONTENT_TYPES,
    maxBytes: ENTERTAINMENT_POSTER_MAX_BYTES,
    slug,
    locale,
  });
  const pendingKey = `poster-frame:${locale}`;

  useEffect(() => {
    if (!objectUrl) {
      return;
    }

    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const handleCapture = async () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setIsCapturing(true);
    onPendingChangeAction(pendingKey, true);

    const frame = await captureVideoFrame(
      video,
      `frame-${locale}-${Math.round(video.currentTime)}.webp`,
    );
    const uploadedFile = frame ? await upload(frame) : null;

    onPendingChangeAction(pendingKey, false);
    setIsCapturing(false);

    if (uploadedFile) {
      onUploadedAction(uploadedFile);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="text"
        startIcon={<MovieFilterOutlinedIcon />}
        onClick={() => setIsOpen(true)}
        sx={{ alignSelf: "flex-start" }}
      >
        {tForm("posterFrame.openButton")}
      </Button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{tForm("posterFrame.dialogTitle")}</DialogTitle>

        <DialogContent>
          <Stack gap={1.5}>
            <Typography variant="body2" color="text.secondary">
              {tForm("posterFrame.dialogDescription")}
            </Typography>

            {objectUrl ? (
              <video
                ref={videoRef}
                src={objectUrl}
                controls
                playsInline
                preload="metadata"
                style={videoSx}
              />
            ) : null}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button type="button" onClick={() => setIsOpen(false)}>
            {tForm("cancelDeleteButton")}
          </Button>
          <Button
            type="button"
            variant="contained"
            onClick={handleCapture}
            disabled={isCapturing}
          >
            {isCapturing
              ? tForm("posterFrame.capturingButton")
              : tForm("posterFrame.captureButton")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export type { AdminEntertainmentPosterFramePickerProps } from "./types";
