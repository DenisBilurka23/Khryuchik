import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import type {
  EntertainmentSubtitleSource,
  EntertainmentSubtitleTrack,
  EntertainmentSubtitleTrackStatus,
} from "@/types/entertainment";

export type AdminEntertainmentSubtitleTrackRow = {
  key: string;
  language: string;
  isPublished: boolean;
  isGenerated: boolean;
  uploadedFile?: AdminEntertainmentUploadedFile;
  storedSource?: EntertainmentSubtitleSource;
  storedStatus?: EntertainmentSubtitleTrackStatus;
  storedFailureReason?: string;
  hasStoredFile: boolean;
};

export type UseAdminEntertainmentSubtitleTracksOptions = {
  storedTracks: EntertainmentSubtitleTrack[];
};

export type UseAdminEntertainmentSubtitleTracksResult = {
  rows: AdminEntertainmentSubtitleTrackRow[];
  serialized: string;
  canAddTrack: boolean;
  setLanguage: (key: string, language: string) => void;
  setPublished: (key: string, isPublished: boolean) => void;
  setUploadedFile: (
    key: string,
    uploadedFile: AdminEntertainmentUploadedFile,
  ) => void;
  addTrack: () => void;
  addGeneratedTrack: () => void;
  removeTrack: (key: string) => void;
};
