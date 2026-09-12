"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Button, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import { useAdminEntertainmentAudioTracks } from "@/hooks/useAdminEntertainmentAudioTracks";

import { AdminSectionCard } from "../../../admin-page-shared";
import { AdminEntertainmentAudioTrackRow } from "./track-row";
import type { AdminEntertainmentAudioSectionProps } from "./types";

export const AdminEntertainmentAudioSection = ({
  locale,
  slug,
  storedTracks,
  onPendingChangeAction,
}: AdminEntertainmentAudioSectionProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const {
    rows,
    serialized,
    canAddTrack,
    setLanguage,
    setUploadedFile,
    addTrack,
    removeTrack,
  } = useAdminEntertainmentAudioTracks({ storedTracks });

  return (
    <AdminSectionCard
      title={tForm("audio.sectionTitle")}
      description={tForm("audio.sectionDescription")}
    >
      <Stack gap={2}>
        <input type="hidden" name="audioTracksJson" value={serialized} />

        {rows.map((row) => (
          <AdminEntertainmentAudioTrackRow
            key={row.key}
            row={row}
            locale={locale}
            slug={slug}
            takenLanguages={rows
              .filter(
                (other) => other.key !== row.key && Boolean(other.language),
              )
              .map((other) => other.language)}
            onLanguageChangeAction={setLanguage}
            onUploadedAction={setUploadedFile}
            onRemoveAction={removeTrack}
            onPendingChangeAction={onPendingChangeAction}
          />
        ))}

        <Button
          type="button"
          variant="outlined"
          startIcon={<AddRoundedIcon />}
          onClick={addTrack}
          disabled={!canAddTrack}
          sx={{ alignSelf: "flex-start", borderRadius: "16px" }}
        >
          {tForm("audio.addTrack")}
        </Button>
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminEntertainmentAudioSectionProps } from "./types";
