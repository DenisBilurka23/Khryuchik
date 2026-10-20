import type { PrintDesignLayout } from "@/types/catalog";

import type { UsePrintStageControlsResult } from "../../hooks/usePrintStageControls.types";
import type { EditablePrintArt, EditablePrintTemplate } from "../types";

export type AdminPrintEditorStageProps = UsePrintStageControlsResult & {
  template: EditablePrintTemplate | null;
  art: EditablePrintArt | null;
  layout: PrintDesignLayout | null;
  showGuides: boolean;
  showCut: boolean;
  isArtFaded: boolean;
  emptyLabel: string;
  ariaLabel: string;
};
