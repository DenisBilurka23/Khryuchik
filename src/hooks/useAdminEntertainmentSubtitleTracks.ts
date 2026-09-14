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
    isGenerated: false,
    storedSource: track.source,
    storedStatus: track.status,
    storedFailureReason: track.failureReason,
    hasStoredFile: Boolean(track.objectKey) && track.status !== "processing",
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

  const appendRow = useCallback(
    (row: Omit<AdminEntertainmentSubtitleTrackRow, "key" | "language">) => {
      setRows((current) =>
        current.length >= ENTERTAINMENT_MAX_SUBTITLE_TRACKS
          ? current
          : [...current, { key: createKey(), language: "", ...row }],
      );
    },
    [],
  );

  const addTrack = useCallback(
    () =>
      appendRow({
        isPublished: true,
        isGenerated: false,
        hasStoredFile: false,
      }),
    [appendRow],
  );

  const addGeneratedTrack = useCallback(
    () =>
      appendRow({
        isPublished: false,
        isGenerated: true,
        hasStoredFile: false,
      }),
    [appendRow],
  );

  const removeTrack = useCallback((key: string) => {
    setRows((current) => current.filter((row) => row.key !== key));
  }, []);

  const serialized = useMemo(
    () =>
      JSON.stringify(
        rows.map((row) => ({
          language: row.language.trim(),
          isPublished: row.isPublished,
          generate: row.isGenerated,
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
    addGeneratedTrack,
    removeTrack,
  };
};
