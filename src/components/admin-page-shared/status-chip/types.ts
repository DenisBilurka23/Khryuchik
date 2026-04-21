export type AdminStatusChipTone = "success" | "warning" | "info" | "neutral" | "accent";

export type AdminStatusChipProps = {
  label: string;
  tone?: AdminStatusChipTone;
};