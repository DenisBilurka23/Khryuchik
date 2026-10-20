import type { PrintEditorViewOptions } from "../types";

export type AdminPrintEditorControlsProps = {
  scale: number;
  fitScale: number;
  disabled: boolean;
  viewOptions: PrintEditorViewOptions;
  onScaleChangeAction: (scale: number) => void;
  onFitAction: () => void;
  onCenterAction: () => void;
  onViewOptionsChangeAction: (patch: Partial<PrintEditorViewOptions>) => void;
};
