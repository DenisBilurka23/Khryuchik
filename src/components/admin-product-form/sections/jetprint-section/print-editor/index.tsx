"use client";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useTranslations } from "next-intl";

import {
  PRINT_DESIGN_ART_ACCEPT,
  PRINT_DESIGN_TEMPLATE_ACCEPT,
} from "@/constants/print-design";

import { usePrintEditor } from "../hooks/usePrintEditor";
import { AdminPrintEditorControls } from "./controls";
import { AdminPrintEditorQualityStatus } from "./quality-status";
import { AdminPrintEditorSourceField } from "./source-field";
import { AdminPrintEditorStage } from "./stage";
import type { AdminJetprintPrintEditorProps } from "./types";

const layoutSx = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "minmax(0, 3fr) minmax(260px, 2fr)" },
  gap: 3,
  alignItems: "start",
} as const;

export const AdminJetprintPrintEditor = ({
  initialDesign,
  onCloseAction,
  onApplyAction,
}: AdminJetprintPrintEditorProps) => {
  const tEditor = useTranslations("adminPage.productForm.jetprint.editor");
  const editor = usePrintEditor({ initialDesign, onApplyAction });
  const { template, art, layout, viewOptions, busy, errorKey } = editor;

  return (
    <Dialog open fullWidth maxWidth="lg" onClose={onCloseAction}>
      <DialogTitle>{tEditor("title")}</DialogTitle>
      <DialogContent dividers>
        <Box sx={layoutSx}>
          <AdminPrintEditorStage
            template={template}
            art={art}
            layout={layout}
            emptyLabel={tEditor("empty")}
            ariaLabel={tEditor("stageLabel")}
            {...viewOptions}
            {...editor.stageControls}
          />

          <Stack gap={2.5}>
            <AdminPrintEditorSourceField
              title={tEditor("templateTitle")}
              label={
                template
                  ? tEditor("templateReplace")
                  : tEditor("templateUpload")
              }
              accept={PRINT_DESIGN_TEMPLATE_ACCEPT}
              size={template}
              disabled={busy !== null}
              onFileAction={editor.loadTemplate}
            />

            <AdminPrintEditorSourceField
              title={tEditor("artTitle")}
              label={art ? tEditor("artReplace") : tEditor("artUpload")}
              accept={PRINT_DESIGN_ART_ACCEPT}
              size={art}
              disabled={busy !== null}
              onFileAction={editor.loadArt}
            />

            {template && art && layout ? (
              <Stack gap={1.5}>
                <AdminPrintEditorControls
                  scale={layout.scale}
                  fitScale={editor.fitScale}
                  disabled={busy !== null}
                  viewOptions={viewOptions}
                  onScaleChangeAction={editor.setScale}
                  onFitAction={editor.fitArt}
                  onCenterAction={editor.centerArt}
                  onViewOptionsChangeAction={editor.updateViewOptions}
                />
                <AdminPrintEditorQualityStatus
                  template={template}
                  art={art}
                  layout={layout}
                />
              </Stack>
            ) : null}

            {errorKey ? (
              <Alert severity="error">{tEditor(errorKey)}</Alert>
            ) : null}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAction} disabled={busy === "render"}>
          {tEditor("cancel")}
        </Button>
        <Button
          variant="contained"
          disabled={!editor.isReady || busy !== null}
          startIcon={
            busy !== null ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
          onClick={editor.apply}
        >
          {tEditor("apply")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export type {
  AdminJetprintPrintEditorProps,
  EditablePrintDesign,
} from "./types";
