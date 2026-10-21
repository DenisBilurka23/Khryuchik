import type { RefObject } from "react";

import type { Locale } from "@/i18n/config";
import type { PrintDesign } from "@/types/catalog";

import type { EditablePrintDesign } from "../print-editor/types";

export type UseJetprintPrintDesignOptions = {
  locale: Locale;
  productId?: string;
  initialDesign?: PrintDesign;
};

export type UseJetprintPrintDesignResult = {
  design: EditablePrintDesign | null;
  setDesign: (design: EditablePrintDesign) => void;
  hiddenInputRef: RefObject<HTMLInputElement | null>;
  value: string;
};
