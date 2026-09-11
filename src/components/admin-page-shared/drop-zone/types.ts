import type { ReactNode } from "react";

export type AdminDropZoneProps = {
  label: string;
  hint: string;
  accept: string;
  onFilesAction: (files: File[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
};
