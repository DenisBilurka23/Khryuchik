import { useState } from "react";

import type { PrintDesignLayout } from "@/types/catalog";
import { centerArtOnBox, fitArtToBox, scaleArtAround } from "@/utils";

import type {
  EditablePrintArt,
  EditablePrintTemplate,
  PrintEditorViewOptions,
} from "../print-editor/types";
import {
  importPrintTemplate,
  PrintTemplateImportError,
  readArtFile,
  renderPrintFile,
} from "../print-editor/utils";
import type {
  PrintEditorBusyState,
  PrintEditorErrorKey,
  UsePrintEditorOptions,
  UsePrintEditorResult,
} from "./usePrintEditor.types";
import { usePrintStageControls } from "./usePrintStageControls";

export const usePrintEditor = ({
  initialDesign,
  onApplyAction,
}: UsePrintEditorOptions): UsePrintEditorResult => {
  const [template, setTemplate] = useState<EditablePrintTemplate | null>(
    initialDesign?.template ?? null,
  );
  const [art, setArt] = useState<EditablePrintArt | null>(
    initialDesign?.art ?? null,
  );
  const [layout, setLayout] = useState<PrintDesignLayout | null>(
    initialDesign?.layout ?? null,
  );
  const [viewOptions, setViewOptions] = useState<PrintEditorViewOptions>({
    showGuides: true,
    showCut: false,
    isArtFaded: false,
  });
  const [busy, setBusy] = useState<PrintEditorBusyState>(null);
  const [errorKey, setErrorKey] = useState<PrintEditorErrorKey | null>(null);

  const isReady = Boolean(template && art && layout);
  const stageControls = usePrintStageControls({
    template,
    isEnabled: isReady && busy === null,
    layout,
    onLayoutChange: setLayout,
  });
  const fitScale =
    template && art ? fitArtToBox(art, template.bleedBox).scale : 1;

  const loadTemplate = async (file: File) => {
    setBusy("template");
    setErrorKey(null);

    try {
      const nextTemplate = await importPrintTemplate(file);

      setTemplate(nextTemplate);

      if (art) {
        setLayout(fitArtToBox(art, nextTemplate.bleedBox));
      }
    } catch (error) {
      setErrorKey(
        error instanceof PrintTemplateImportError &&
          error.code === "missing-layers"
          ? "errors.missingLayers"
          : "errors.unreadable",
      );
    } finally {
      setBusy(null);
    }
  };

  const loadArt = async (file: File) => {
    setBusy("art");
    setErrorKey(null);

    try {
      const nextArt = await readArtFile(file);

      setArt(nextArt);

      if (template) {
        setLayout(fitArtToBox(nextArt, template.bleedBox));
      }
    } catch {
      setErrorKey("errors.art");
    } finally {
      setBusy(null);
    }
  };

  const apply = async () => {
    if (!template || !art || !layout) {
      return;
    }

    setBusy("render");
    setErrorKey(null);

    try {
      const design = { template, art, layout };

      onApplyAction(design, await renderPrintFile(design));
    } catch {
      setErrorKey("errors.render");
      setBusy(null);
    }
  };

  return {
    template,
    art,
    layout,
    viewOptions,
    busy,
    errorKey,
    isReady,
    fitScale,
    stageControls,
    loadTemplate,
    loadArt,
    apply,
    setScale: (scale) => {
      if (template && layout) {
        setLayout(
          scaleArtAround(layout, scale, {
            x: template.width / 2,
            y: template.height / 2,
          }),
        );
      }
    },
    fitArt: () => {
      if (template && art) {
        setLayout(fitArtToBox(art, template.bleedBox));
      }
    },
    centerArt: () => {
      if (template && art && layout) {
        setLayout(centerArtOnBox(art, template.bleedBox, layout.scale));
      }
    },
    updateViewOptions: (patch) =>
      setViewOptions((current) => ({ ...current, ...patch })),
  };
};
