import type { AdminEntertainmentUploadedFile } from "@/types/admin";
import type {
  EntertainmentAudioTrack,
  EntertainmentAudioTrackStatus,
} from "@/types/entertainment";

export type AdminEntertainmentAudioTrackRow = {
  key: string;
  language: string;
  isDefault: boolean;
  uploadedFile?: AdminEntertainmentUploadedFile;
  storedStatus?: EntertainmentAudioTrackStatus;
  hasStoredSource: boolean;
};

export type UseAdminEntertainmentAudioTracksOptions = {
  storedTracks: EntertainmentAudioTrack[];
};

export type UseAdminEntertainmentAudioTracksResult = {
  rows: AdminEntertainmentAudioTrackRow[];
  serialized: string;
  canAddTrack: boolean;
  setLanguage: (key: string, language: string) => void;
  setUploadedFile: (
    key: string,
    uploadedFile: AdminEntertainmentUploadedFile,
  ) => void;
  addTrack: () => void;
  removeTrack: (key: string) => void;
};
