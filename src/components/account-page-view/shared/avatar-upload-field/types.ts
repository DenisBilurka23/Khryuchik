export type AccountAvatarUploadFieldProps = {
  imageSrc?: string | null;
  imageAlt: string;
  fallbackLabel: string;
  changeLabel: string;
  replaceLabel: string;
  emptyLabel: string;
  onFileSelectAction: (file: File) => void;
  onRequestEditAction?: () => void;
};