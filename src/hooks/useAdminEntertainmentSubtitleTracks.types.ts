import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import type {
  EntertainmentSubtitleSource,
  EntertainmentSubtitleTrack,
} from "@/types/entertainment";

export type AdminEntertainmentSubtitleTrackRow = {
  key: string;
  language: string;
  isPublished: boolean;
  uploadedFile?: AdminEntertainmentUploadedFile;
  storedSource?: EntertainmentSubtitleSource;
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
  removeTrack: (key: string) => void;
};
