"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { Button, Stack } from "@mui/material";
import { useTranslations } from "next-intl";

import { useAdminEntertainmentSubtitleTracks } from "@/hooks/useAdminEntertainmentSubtitleTracks";

import { AdminSectionCard } from "../../../admin-page-shared";
import { AdminEntertainmentSubtitleTrackRow } from "./track-row";
import type { AdminEntertainmentSubtitleSectionProps } from "./types";

export const AdminEntertainmentSubtitleSection = ({
  locale,
  slug,
  storedTracks,
  onPendingChangeAction,
}: AdminEntertainmentSubtitleSectionProps) => {
  const tForm = useTranslations("adminPage.entertainmentForm");
  const {
    rows,
    serialized,
    canAddTrack,
    setLanguage,
    setPublished,
    setUploadedFile,
    addTrack,
    addGeneratedTrack,
    removeTrack,
  } = useAdminEntertainmentSubtitleTracks({ storedTracks });

  return (
    <AdminSectionCard
      title={tForm("subtitles.sectionTitle")}
      description={tForm("subtitles.sectionDescription")}
    >
      <Stack gap={2}>
        <input type="hidden" name="subtitleTracksJson" value={serialized} />

        {rows.map((row) => (
          <AdminEntertainmentSubtitleTrackRow
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
            onPublishedChangeAction={setPublished}
            onUploadedAction={setUploadedFile}
            onRemoveAction={removeTrack}
            onPendingChangeAction={onPendingChangeAction}
          />
        ))}

        <Stack direction="row" gap={1.5} flexWrap="wrap">
          <Button
            type="button"
            variant="outlined"
            startIcon={<AddRoundedIcon />}
            onClick={addTrack}
            disabled={!canAddTrack}
            sx={{ borderRadius: "16px" }}
          >
            {tForm("subtitles.addTrack")}
          </Button>

          <Button
            type="button"
            variant="outlined"
            startIcon={<AutoAwesomeRoundedIcon />}
            onClick={addGeneratedTrack}
            disabled={!canAddTrack}
            sx={{ borderRadius: "16px" }}
          >
            {tForm("subtitles.generateTrack")}
          </Button>
        </Stack>
      </Stack>
    </AdminSectionCard>
  );
};

export type { AdminEntertainmentSubtitleSectionProps } from "./types";
