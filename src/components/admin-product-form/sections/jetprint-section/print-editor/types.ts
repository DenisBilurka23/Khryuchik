import type {
  PrintDesignBox,
  PrintDesignLayout,
  PrintDesignSize,
} from "@/types/catalog";

export type PrintDesignAsset = {
  url: string;
  file?: File;
};

export type EditablePrintTemplate = PrintDesignSize & {
  dpi: number;
  bleedBox: PrintDesignBox;
  safeBox: PrintDesignBox;
  guides: PrintDesignAsset;
  cutMask: PrintDesignAsset;
};

export type EditablePrintArt = PrintDesignSize & {
  source: PrintDesignAsset;
};

export type EditablePrintDesign = {
  template: EditablePrintTemplate;
  art: EditablePrintArt;
  layout: PrintDesignLayout;
};

export type AdminJetprintPrintEditorProps = {
  initialDesign: EditablePrintDesign | null;
  onCloseAction: () => void;
  onApplyAction: (design: EditablePrintDesign, printFile: File) => void;
};

export type PrintEditorViewOptions = {
  showGuides: boolean;
  showCut: boolean;
  isArtFaded: boolean;
};

export type PrintTemplateImportErrorCode = "missing-layers" | "unreadable";
