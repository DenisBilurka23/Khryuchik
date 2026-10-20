import type { ReactNode, RefObject } from "react";

import type { UseJetprintFileUploadsResult } from "../hooks/useJetprintFileUploads.types";

export type AdminJetprintFilesFieldProps = {
  name: string;
  title: string;
  helperText: string;
  inputRef: RefObject<HTMLInputElement | null>;
  uploads: Omit<UseJetprintFileUploadsResult, "hiddenInputRef">;
  actions?: ReactNode;
};
