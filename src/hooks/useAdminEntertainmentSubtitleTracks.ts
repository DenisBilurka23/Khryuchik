"use client";

import { useCallback, useMemo, useState } from "react";

import { ENTERTAINMENT_MAX_SUBTITLE_TRACKS } from "@/constants/entertainment";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import type { EntertainmentSubtitleTrack } from "@/types/entertainment";

import type {
  AdminEntertainmentSubtitleTrackRow,
  UseAdminEntertainmentSubtitleTracksOptions,
  UseAdminEntertainmentSubtitleTracksResult,
} from "./useAdminEntertainmentSubtitleTracks.types";

const createKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const toRows = (
  storedTracks: EntertainmentSubtitleTrack[],
): AdminEntertainmentSubtitleTrackRow[] =>
  storedTracks.map((track, index) => ({
    key: track.id || `subtitle-${index}`,
    language: track.language,
    isPublished: track.isPublished,
    storedSource: track.source,
    hasStoredFile: Boolean(track.objectKey),
  }));

export const useAdminEntertainmentSubtitleTracks = ({
  storedTracks,
}: UseAdminEntertainmentSubtitleTracksOptions): UseAdminEntertainmentSubtitleTracksResult => {
  const [rows, setRows] = useState<AdminEntertainmentSubtitleTrackRow[]>(() =>
    toRows(storedTracks),
  );

  const setLanguage = useCallback((key: string, language: string) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, language } : row)),
    );
  }, []);

  const setPublished = useCallback((key: string, isPublished: boolean) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, isPublished } : row)),
    );
  }, []);

  const setUploadedFile = useCallback(
    (key: string, uploadedFile: AdminEntertainmentUploadedFile) => {
      setRows((current) =>
        current.map((row) =>
          row.key === key ? { ...row, uploadedFile } : row,
        ),
      );
    },
    [],
  );

  const addTrack = useCallback(() => {
    setRows((current) =>
      current.length >= ENTERTAINMENT_MAX_SUBTITLE_TRACKS
        ? current
        : [
            ...current,
            {
              key: createKey(),
              language: "",
              isPublished: true,
              hasStoredFile: false,
            },
          ],
    );
  }, []);

  const removeTrack = useCallback((key: string) => {
    setRows((current) => current.filter((row) => row.key !== key));
  }, []);

  const serialized = useMemo(
    () =>
      JSON.stringify(
        rows.map((row) => ({
          language: row.language.trim(),
          isPublished: row.isPublished,
          uploadedFile: row.uploadedFile,
        })),
      ),
    [rows],
  );

  return {
    rows,
    serialized,
    canAddTrack: rows.length < ENTERTAINMENT_MAX_SUBTITLE_TRACKS,
    setLanguage,
    setPublished,
    setUploadedFile,
    addTrack,
    removeTrack,
  };
};
