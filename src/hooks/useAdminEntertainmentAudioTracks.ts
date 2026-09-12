"use client";

import { useCallback, useMemo, useState } from "react";

import { ENTERTAINMENT_MAX_AUDIO_TRACKS } from "@/constants/entertainment";
import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import type { EntertainmentAudioTrack } from "@/types/entertainment";

import type {
  AdminEntertainmentAudioTrackRow,
  UseAdminEntertainmentAudioTracksOptions,
  UseAdminEntertainmentAudioTracksResult,
} from "./useAdminEntertainmentAudioTracks.types";

const createKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const toRows = (
  storedTracks: EntertainmentAudioTrack[],
): AdminEntertainmentAudioTrackRow[] => {
  const rows = storedTracks.map((track, index) => ({
    key: track.id || `track-${index}`,
    language: track.language,
    isDefault: track.isDefault,
    storedStatus: track.status,
    hasStoredSource: Boolean(track.sourceObjectKey),
  }));

  if (rows.some((row) => row.isDefault)) {
    return rows;
  }

  return [
    {
      key: "master",
      language: "",
      isDefault: true,
      hasStoredSource: false,
    },
    ...rows,
  ];
};

export const useAdminEntertainmentAudioTracks = ({
  storedTracks,
}: UseAdminEntertainmentAudioTracksOptions): UseAdminEntertainmentAudioTracksResult => {
  const [rows, setRows] = useState<AdminEntertainmentAudioTrackRow[]>(() =>
    toRows(storedTracks),
  );

  const setLanguage = useCallback((key: string, language: string) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, language } : row)),
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
      current.length >= ENTERTAINMENT_MAX_AUDIO_TRACKS
        ? current
        : [
            ...current,
            {
              key: createKey(),
              language: "",
              isDefault: false,
              hasStoredSource: false,
            },
          ],
    );
  }, []);

  const removeTrack = useCallback((key: string) => {
    setRows((current) =>
      current.filter((row) => row.isDefault || row.key !== key),
    );
  }, []);

  const serialized = useMemo(
    () =>
      JSON.stringify(
        rows.map((row) => ({
          language: row.language.trim(),
          isDefault: row.isDefault,
          uploadedFile: row.uploadedFile,
        })),
      ),
    [rows],
  );

  return {
    rows,
    serialized,
    canAddTrack: rows.length < ENTERTAINMENT_MAX_AUDIO_TRACKS,
    setLanguage,
    setUploadedFile,
    addTrack,
    removeTrack,
  };
};
