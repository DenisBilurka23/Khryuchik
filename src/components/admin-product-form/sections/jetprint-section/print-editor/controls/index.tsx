"use client";

import {
  Box,
  Button,
  FormControlLabel,
  Slider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

import { clampPrintScale } from "@/utils";

import type { AdminPrintEditorControlsProps } from "./types";

export const AdminPrintEditorControls = ({
  scale,
  fitScale,
  disabled,
  viewOptions,
  onScaleChangeAction,
  onFitAction,
  onCenterAction,
  onViewOptionsChangeAction,
}: AdminPrintEditorControlsProps) => {
  const tEditor = useTranslations("adminPage.productForm.jetprint.editor");

  return (
    <>
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {tEditor("scaleLabel", { percent: Math.round(scale * 100) })}
        </Typography>
        <Slider
          value={scale}
          min={clampPrintScale(fitScale * 0.25)}
          max={clampPrintScale(fitScale * 3)}
          step={0.001}
          disabled={disabled}
          onChange={(_, value) => onScaleChangeAction(value as number)}
          aria-label={tEditor("scaleAria")}
        />
      </Box>

      <Stack direction="row" gap={1} flexWrap="wrap">
        <Button variant="contained" disabled={disabled} onClick={onFitAction}>
          {tEditor("fit")}
        </Button>
        <Button variant="outlined" disabled={disabled} onClick={onCenterAction}>
          {tEditor("center")}
        </Button>
      </Stack>

      <Stack>
        <FormControlLabel
          control={
            <Switch
              checked={viewOptions.showGuides}
              onChange={(event) =>
                onViewOptionsChangeAction({ showGuides: event.target.checked })
              }
            />
          }
          label={tEditor("showGuides")}
        />
        <FormControlLabel
          control={
            <Switch
              checked={viewOptions.showCut}
              onChange={(event) =>
                onViewOptionsChangeAction({ showCut: event.target.checked })
              }
            />
          }
          label={tEditor("showCut")}
        />
        <FormControlLabel
          control={
            <Switch
              checked={viewOptions.isArtFaded}
              onChange={(event) =>
                onViewOptionsChangeAction({ isArtFaded: event.target.checked })
              }
            />
          }
          label={tEditor("fadeArt")}
        />
      </Stack>

      <Typography variant="body2" color="text.secondary">
        {tEditor("hint")}
      </Typography>
    </>
  );
};

export type { AdminPrintEditorControlsProps } from "./types";
