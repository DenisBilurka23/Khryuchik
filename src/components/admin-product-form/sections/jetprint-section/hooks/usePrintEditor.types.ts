import type { PrintDesignLayout } from "@/types/catalog";

import type {
  AdminJetprintPrintEditorProps,
  EditablePrintArt,
  EditablePrintTemplate,
  PrintEditorViewOptions,
} from "../print-editor/types";
import type { UsePrintStageControlsResult } from "./usePrintStageControls.types";

export type PrintEditorBusyState = "template" | "art" | "render" | null;

export type PrintEditorErrorKey =
  | "errors.missingLayers"
  | "errors.unreadable"
  | "errors.art"
  | "errors.render";

export type UsePrintEditorOptions = Pick<
  AdminJetprintPrintEditorProps,
  "initialDesign" | "onApplyAction"
>;

export type UsePrintEditorResult = {
  template: EditablePrintTemplate | null;
  art: EditablePrintArt | null;
  layout: PrintDesignLayout | null;
  viewOptions: PrintEditorViewOptions;
  busy: PrintEditorBusyState;
  errorKey: PrintEditorErrorKey | null;
  isReady: boolean;
  fitScale: number;
  stageControls: UsePrintStageControlsResult;
  loadTemplate: (file: File) => Promise<void>;
  loadArt: (file: File) => Promise<void>;
  apply: () => Promise<void>;
  setScale: (scale: number) => void;
  fitArt: () => void;
  centerArt: () => void;
  updateViewOptions: (patch: Partial<PrintEditorViewOptions>) => void;
};
