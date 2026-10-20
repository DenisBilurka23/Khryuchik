import type { PrintDesignSize } from "@/types/catalog";

export type AdminPrintEditorSourceFieldProps = {
  title: string;
  label: string;
  accept: string;
  size: PrintDesignSize | null;
  disabled: boolean;
  onFileAction: (file: File) => void | Promise<void>;
};
